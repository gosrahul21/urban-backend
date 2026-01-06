import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.entity';
import { ServiceProvider } from '../service-provider/service-provider.entity';
import { Service } from '../services/service.entity';
import { OrderStatus } from 'src/common/enums/order.enum';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, index: true })
  userId: string; // auth service userId

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: Service.name, required: true })
  serviceIds: Types.ObjectId[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.CREATED,
    index: true,
  })
  status: OrderStatus;

  @Prop({
    type: Types.ObjectId,
    ref: ServiceProvider.name,
  })
  serviceProviderId?: Types.ObjectId;

  @Prop()
  scheduledAt?: Date;

  @Prop()
  cancelledReason?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = Order & Document;
// OrderSchema.index({ userId: 1, createdAt: -1 });
// OrderSchema.index({ status: 1, cityId: 1 });
