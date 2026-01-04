import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceProvider,
  ServiceProviderStatus,
} from './service-provider.entity';

@Injectable()
export class ServiceProviderService {
  constructor(
    @InjectModel(ServiceProvider.name)
    private readonly serviceProviderModel: Model<ServiceProvider>,
  ) {}

  // Create Service Provider
  async createServiceProvider(payload: {
    userId: string;
    cityId: string;
    serviceIds: string[];
  }) {
    return new this.serviceProviderModel({
      userId: payload.userId,
      serviceIds: payload.serviceIds.map((id) => new Types.ObjectId(id)),
      cityId: new Types.ObjectId(payload.cityId),
    }).save();
  }

  // Get by ID
  async getServiceProviderById(id: string) {
    const provider = await this.serviceProviderModel
      .findById(id)
      .populate('serviceIds', 'name')
      .lean();

    if (!provider) {
      throw new NotFoundException('Service provider not found');
    }
    return provider;
  }

  // Get by userId
  async getByUserId(userId: string) {
    const provider = await this.serviceProviderModel
      .findOne({ userId })
      .populate('serviceIds', 'name')
      .lean();

    if (!provider) {
      throw new NotFoundException('Service provider not found');
    }
    return provider;
  }

  // List providers by service
  async getProvidersByService(
    serviceId: string,
    status?: ServiceProviderStatus,
  ) {
    const filter: any = {
      serviceIds: new Types.ObjectId(serviceId),
      isActive: true,
    };

    if (status) filter.status = status;

    return this.serviceProviderModel
      .find(filter)
      .populate('serviceIds', 'name')
      .lean();
  }

  // Update provider services
  async updateServices(id: string, serviceIds: string[]) {
    const updated = await this.serviceProviderModel.findByIdAndUpdate(
      id,
      {
        serviceIds: serviceIds.map((sid) => new Types.ObjectId(sid)),
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Service provider not found');
    }

    return updated;
  }

  // Update provider status (real-time use)
  async updateStatus(id: string, status: ServiceProviderStatus) {
    const updated = await this.serviceProviderModel.findByIdAndUpdate(
      id,
      {
        status,
        lastOnlineAt:
          status === ServiceProviderStatus.OFFLINE ? null : new Date(),
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Service provider not found');
    }

    return updated;
  }

  // Soft disable provider
  async deactivateProvider(id: string) {
    const updated = await this.serviceProviderModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Service provider not found');
    }

    return { message: 'Service provider deactivated' };
  }

  async getProvidersByFilter(filter: {
    cityId: string;
    serviceIds: string[];
    status?: ServiceProviderStatus;
  }) {
    const query: any = {
      cityId: new Types.ObjectId(filter.cityId),
      serviceIds: {
        $in: filter.serviceIds.map((id) => new Types.ObjectId(id)),
      },
    };

    // apply status filter only if present
    if (filter.status) {
      query.status = filter.status;
    }

    return this.serviceProviderModel
      .find(query)
      .populate('serviceIds', 'name')
      .lean();
  }
}
