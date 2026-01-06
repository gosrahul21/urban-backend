import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './order.entity';
import { Service } from '../services/service.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { OrderStatus } from 'src/common/enums/order.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @InjectModel(Service.name)
    private readonly serviceModel: Model<Service>,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const services = await this.serviceModel.find({
      _id: { $in: dto.serviceIds },
      categoryId: dto.categoryId,
      isActive: true,
    });

    if (!services.length) {
      throw new BadRequestException('Invalid services selected');
    }

    const items = services.map((s) => ({
      serviceId: s._id,
      serviceName: s.name,
      price: s.price ?? 0,
      duration: s.duration ?? 0,
    }));

    const totalAmount = items.reduce((a, b) => a + b.price, 0);

    return this.orderModel.create({
      userId,
      categoryId: dto.categoryId,
      serviceIds: dto.serviceIds.map((id) => new Types.ObjectId(id)),
      totalAmount,
      scheduledAt: dto.scheduledAt,
    });
  }

  async cancelOrder(orderId: string, userId: string, dto: CancelOrderDto) {
    const order = await this.orderModel.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (![OrderStatus.CREATED, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException(
        `Order cannot be cancelled in ${order.status} state`,
      );
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledReason = dto.reason;
    await order.save();
    return order;
  }
}
