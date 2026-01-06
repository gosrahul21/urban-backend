import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Order } from '../orders/order.entity';
import { ServiceProvider } from '../service-provider/service-provider.entity';
import { ProviderMatchStatus } from './provider-match-status.enum';

@Schema({ timestamps: true })
export class ProviderMatchHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: Order.name, required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: ServiceProvider.name,
    required: true,
    index: true,
  })
  serviceProviderId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ProviderMatchStatus,
    default: ProviderMatchStatus.PENDING,
    index: true,
  })
  status: ProviderMatchStatus;

  @Prop()
  respondedAt?: Date;

  @Prop()
  expiresAt: Date;
}

export const ProviderMatchHistorySchema =
  SchemaFactory.createForClass(ProviderMatchHistory);

ProviderMatchHistorySchema.index(
  { orderId: 1, serviceProviderId: 1 },
  { unique: true },
);
