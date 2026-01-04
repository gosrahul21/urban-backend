import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service } from './service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<Service>,
  ) {}

  async createService(payload: {
    name: string;
    description: string;
    categoryId: string;
  }) {
    return new this.serviceModel({
      ...payload,
      categoryId: new Types.ObjectId(payload.categoryId),
    }).save();
  }

  async getServices(filter: any){
    return await this.serviceModel.find(filter).lean()
  }

  async getServiceById(id: string) {
    const service = await this.serviceModel
      .findById(id)
      .populate('categoryId', 'name')
      .lean();

    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async getServicesByCategory(
    categoryId: string,
    pageNo = 1,
    limit = 10,
  ) {
    const skip = (pageNo - 1) * limit;

    const [data, total] = await Promise.all([
      this.serviceModel
        .find({ categoryId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('categoryId', 'name')
        .lean(),
      this.serviceModel.countDocuments({ categoryId }),
    ]);

    return {
      data,
      pagination: {
        pageNo,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateService(
    id: string,
    payload: Partial<{
      name: string;
      description: string;
      categoryId: string;
      isActive: boolean;
    }>,
  ) {
    if (payload.categoryId) {
      payload.categoryId = new Types.ObjectId(
        payload.categoryId,
      ) as any;
    }

    const updated = await this.serviceModel.findByIdAndUpdate(
      id,
      payload,
      { new: true },
    );

    if (!updated) throw new NotFoundException('Service not found');
    return updated;
  }

  async deleteService(id: string) {
    const deleted = await this.serviceModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Service not found');
    return { message: 'Service deleted successfully' };
  }
}
