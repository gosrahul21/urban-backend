import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../order/order.entity';
import {
  ServiceProvider,
  ServiceProviderStatus,
} from '../service-provider/service-provider.entity';
import { ProviderMatchHistory } from './match-history.entity';
import { ServiceProviderAvailability } from '../service-provider/entities/service-provider-availability.entity';
import { OrderStatus } from 'src/common/enums/order.enum';
import { ProviderMatchStatus } from 'src/common/enums/provider-match-status.enum';

@Injectable()
export class ServiceMatchingService implements OnModuleInit, OnModuleDestroy {
  // Map to store pending match timeouts: matchId -> NodeJS.Timeout
  private pendingMatchTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    @InjectModel(ServiceProvider.name)
    private readonly spModel: Model<ServiceProvider>,

    @InjectModel(ProviderMatchHistory.name)
    private readonly matchModel: Model<ProviderMatchHistory>,

    @InjectModel(ServiceProviderAvailability.name)
    private readonly availabilityModel: Model<ServiceProviderAvailability>,
  ) {}

  async onModuleInit() {
    // Fetch all pending matches on application start
    await this.initializePendingMatches();
  }

  onModuleDestroy() {
    // Clear all timeouts on application shutdown
    this.clearAllTimeouts();
  }

  /**
   * Fetch pending matches and start their timeouts on application startup
   */
  private async initializePendingMatches() {
    const pendingMatches = await this.matchModel.find({
      status: ProviderMatchStatus.PENDING,
      expiresAt: { $gt: new Date() }, // Only active pending matches
    });

    for (const match of pendingMatches) {
      const matchId = match._id.toString();
      const expiresAt = new Date(match.expiresAt);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      if (timeUntilExpiry > 0) {
        this.setMatchTimeout(
          matchId,
          match.orderId.toString(),
          timeUntilExpiry,
        );
      } else {
        // Match already expired, handle it immediately
        await this.handleExpiredMatch(matchId, match.orderId.toString());
      }
    }
  }

  /**
   * Set timeout for a match
   */
  private setMatchTimeout(matchId: string, orderId: string, timeoutMs: number) {
    // Clear existing timeout if any
    this.clearMatchTimeout(matchId);

    const timeout = setTimeout(() => {
      this.handleExpiredMatch(matchId, orderId).catch((error) => {
        console.error(`Error handling expired match ${matchId}:`, error);
      });
    }, timeoutMs);

    this.pendingMatchTimeouts.set(matchId, timeout);
  }

  /**
   * Clear timeout for a specific match
   */
  private clearMatchTimeout(matchId: string) {
    const timeout = this.pendingMatchTimeouts.get(matchId);
    if (timeout) {
      clearTimeout(timeout);
      this.pendingMatchTimeouts.delete(matchId);
    }
  }

  /**
   * Clear all pending timeouts
   */
  private clearAllTimeouts() {
    for (const [, timeout] of this.pendingMatchTimeouts.entries()) {
      clearTimeout(timeout);
    }
    this.pendingMatchTimeouts.clear();
  }

  /**
   * Handle expired match: mark as expired and find next SP
   */
  private async handleExpiredMatch(matchId: string, orderId: string) {
    // Remove timeout from map
    this.clearMatchTimeout(matchId);

    // Check if match still exists and is still pending
    const match = await this.matchModel.findOne({
      _id: matchId,
      status: ProviderMatchStatus.PENDING,
    });

    if (!match) {
      // Match was already handled (accepted/rejected)
      return;
    }

    // Check if order is still in CONFIRMED status
    const order = await this.orderModel.findById(orderId);
    if (!order || order.status !== OrderStatus.CONFIRMED) {
      // Order is no longer in confirmed status, just mark match as expired
      await this.matchModel.findByIdAndUpdate(matchId, {
        status: ProviderMatchStatus.EXPIRED,
      });
      return;
    }

    // Mark match as expired
    await this.matchModel.findByIdAndUpdate(matchId, {
      status: ProviderMatchStatus.EXPIRED,
    });

    // Find next service provider
    await this.startMatching(orderId);
  }

  async startMatching(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order || order.status !== OrderStatus.CONFIRMED) return;

    const excludedSpIds = await this.matchModel.distinct('serviceProviderId', {
      orderId,
    });

    const date = new Date(order.scheduledAt!);
    const dayOfWeek = date.getDay();
    const startMinute = date.getHours() * 60 + date.getMinutes();
    const endMinute = startMinute + (order as any).totalDuration;

    const availableSpIds = await this.availabilityModel.distinct(
      'serviceProviderId',
      {
        dayOfWeek,
        startMinute: { $lte: startMinute },
        endMinute: { $gte: endMinute },
      },
    );

    const sp = await this.spModel.findOne({
      _id: {
        $in: availableSpIds,
        $nin: excludedSpIds,
      },
      cityId: (order as any).cityId,
      serviceIds: {
        $in:
          (order as any).items?.map((i: any) => i.serviceId) ||
          order.serviceIds,
      },
      status: ServiceProviderStatus.AVAILABLE,
      isActive: true,
    });

    if (!sp) {
      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.CANCELLED,
        cancelledReason: 'No service provider available',
      });
      return;
    }

    const match = await this.matchModel.create({
      orderId,
      serviceProviderId: sp._id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // 🔔 push notification to SP here

    // Create timeout for this match
    const matchId = match._id.toString();
    const timeoutMs = 5 * 60 * 1000; // 5 minutes
    this.setMatchTimeout(matchId, orderId, timeoutMs);
  }

  async acceptRequest(matchId: string, spId: string) {
    const match = await this.matchModel.findOne({
      _id: matchId,
      serviceProviderId: spId,
      status: ProviderMatchStatus.PENDING,
    });

    if (!match || match.expiresAt < new Date()) {
      throw new BadRequestException('Request expired');
    }

    // Clear timeout for this match
    this.clearMatchTimeout(matchId);

    const order = await this.orderModel.findOneAndUpdate(
      {
        _id: match.orderId,
        status: OrderStatus.CONFIRMED,
      },
      {
        status: OrderStatus.ASSIGNED,
        serviceProviderId: spId,
      },
      { new: true },
    );

    if (!order) {
      throw new ConflictException('Order already assigned');
    }

    match.status = ProviderMatchStatus.ACCEPTED;
    match.respondedAt = new Date();
    await match.save();

    // Clear timeouts for all other matches for this order
    const otherMatches = await this.matchModel.find({
      orderId: match.orderId,
      _id: { $ne: match._id },
      status: ProviderMatchStatus.PENDING,
    });

    for (const otherMatch of otherMatches) {
      this.clearMatchTimeout(otherMatch._id.toString());
    }

    await this.matchModel.updateMany(
      {
        orderId: match.orderId,
        _id: { $ne: match._id },
      },
      { status: ProviderMatchStatus.CANCELLED },
    );

    return order;
  }

  async rejectRequest(matchId: string, spId: string) {
    const match = await this.matchModel.findOneAndUpdate(
      {
        _id: matchId,
        serviceProviderId: spId,
        status: ProviderMatchStatus.PENDING,
      },
      {
        status: ProviderMatchStatus.REJECTED,
        respondedAt: new Date(),
      },
      { new: true },
    );

    if (!match) {
      throw new BadRequestException('Invalid request');
    }

    // Clear timeout for this match
    this.clearMatchTimeout(matchId);

    // 🔁 Restart matching loop
    await this.startMatching(match.orderId.toString());

    return match;
  }
}
