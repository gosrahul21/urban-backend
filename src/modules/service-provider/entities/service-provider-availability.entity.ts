import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceProvider } from '../service-provider.entity';

@Schema({ timestamps: true })
export class ServiceProviderAvailability extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: ServiceProvider.name,
    required: true,
    index: true,
  })
  serviceProviderId: Types.ObjectId;

  @Prop({
    type: Number,
    enum: DayOfWeek,
    required: true,
    index: true,
  })
  dayOfWeek: DayOfWeek;

  @Prop({ required: true })
  startMinute: number; // e.g. 9:00 → 540

  @Prop({ required: true })
  endMinute: number; // e.g. 10:30 → 630

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ServiceProviderAvailabilitySchema = SchemaFactory.createForClass(
  ServiceProviderAvailability,
);

ServiceProviderAvailabilitySchema.index(
  {
    serviceProviderId: 1,
    dayOfWeek: 1,
    startMinute: 1,
    endMinute: 1,
  },
  { unique: true },
);
