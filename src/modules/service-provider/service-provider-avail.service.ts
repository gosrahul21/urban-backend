import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
  import { ServiceProviderAvailability } from './entities/service-provider-availability.entity';
import { DayOfWeek } from 'src/common/enums/day-of-week.enum';

interface AvailabilitySlotInput {
  dayOfWeek: DayOfWeek;
  start: string; // "09:00"
  end: string;   // "18:00"
}

@Injectable()
export class ServiceProviderAvailabilityService {
  constructor(
    @InjectModel(ServiceProviderAvailability.name)
    private readonly availabilityModel: Model<ServiceProviderAvailability>,
  ) {}

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private validateSlot(start: number, end: number) {
    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }
  }

  async setAvailability(
    serviceProviderId: string,
    slots: AvailabilitySlotInput[],
  ) {
    const spId = new Types.ObjectId(serviceProviderId);

    await this.availabilityModel.deleteMany({ serviceProviderId: spId });

    const docs = slots.map((slot) => {
      const startMinute = this.toMinutes(slot.start);
      const endMinute = this.toMinutes(slot.end);

      this.validateSlot(startMinute, endMinute);

      return {
        serviceProviderId: spId,
        dayOfWeek: slot.dayOfWeek,
        startMinute,
        endMinute,
      };
    });

    return this.availabilityModel.insertMany(docs);
  }

  async getAvailability(serviceProviderId: string) {
    return this.availabilityModel
      .find({ serviceProviderId })
      .sort({ dayOfWeek: 1, startMinute: 1 })
      .lean();
  }

  async deleteAvailability(serviceProviderId: string) {
    return this.availabilityModel.deleteMany({
      serviceProviderId,
    });
  }
}
