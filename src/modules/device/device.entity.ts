import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Device {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  deviceToken: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
export type DeviceType = Document & Device;
