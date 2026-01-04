import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class City extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  state: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  country: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
  })
  zipCode: string;
}

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.index({ name: 1, state: 1, country: 1 }, { unique: true });
export type CityDocument = City & Document;