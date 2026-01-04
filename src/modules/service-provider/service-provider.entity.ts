import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Service } from '../services/service.entity';
import { City } from '../cities/city.entity';

export enum ServiceProviderStatus {
  OFFLINE = 'offline',
  AVAILABLE = 'available',
  BUSY = 'busy',
  IN_SERVICE = 'inservice',
  ON_REST = 'rest',
}

@Schema({ timestamps: true })
export class ServiceProvider extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  userId: string; // reference to User service (auth system)

  @Prop({
    type: [Types.ObjectId],
    ref: Service.name,
    required: true,
  })
  serviceIds: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ServiceProviderStatus,
    default: ServiceProviderStatus.OFFLINE,
    index: true,
  })
  status: ServiceProviderStatus;

  @Prop({
    type: Boolean,
    default: false,
  })
  verified: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
  })
  lastOnlineAt: Date;

  @Prop({
    type: Number,
    default: 0,
  })
  rating; // average rating

  @Prop({
    type: Number,
    default: 0,
  })
  totalJobsCompleted;

  @Prop({
    type: Number,
    default: 0,
  })
  totalJobsCancelled;

  @Prop({
    type: Types.ObjectId,
    ref: City.name,
    required: true,
    index: true,
  })
  cityId: Types.ObjectId;
}

export const ServiceProviderSchema =
  SchemaFactory.createForClass(ServiceProvider);
