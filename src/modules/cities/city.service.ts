import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from './city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name)
    private readonly cityModel: Model<City>,
  ) {}

  async createCity(payload: {
    name: string;
    state: string;
    country: string;
  }) {
    return new this.cityModel(payload).save();
  }

  async getCityById(id: string) {
    const city = await this.cityModel.findById(id).lean();
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  async getCities(pageNo = 1, limit = 10) {
    const skip = (pageNo - 1) * limit;

    const [data, total] = await Promise.all([
      this.cityModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.cityModel.countDocuments(),
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

  async updateCity(
    id: string,
    payload: Partial<{ name: string; state: string; country: string }>,
  ) {
    const updated = await this.cityModel.findByIdAndUpdate(
      id,
      payload,
      { new: true },
    );

    if (!updated) throw new NotFoundException('City not found');
    return updated;
  }

  async deleteCity(id: string) {
    const deleted = await this.cityModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('City not found');
    return { message: 'City deleted successfully' };
  }
}
