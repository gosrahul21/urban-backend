import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.entity';
import { SubCategory } from '../sub-category/sub-category.entity';

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SubCategory.name,
    required: true,
    index: true,
  })
  subCategoryId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    type: [String],
    required: false,
  })
  imageUrls: string[];

  @Prop({
    type: [String],
    required: false,
  })
  features: string[];

  @Prop({
    type: Number,
    required: false,
  })
  price: number;

  @Prop({
    type: Number,
    required: false,
  })
  duration: number;

  @Prop({
    type: Number,
    required: false,
  })
  rating: number;

  @Prop({
    type: [String],
    required: false,
  })
  videoUrls: string[];

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
    index: true,
  })
  categoryId: Types.ObjectId;

  @Prop({
    required: true,
  })
  cityId: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.index({ name: 1, categoryId: 1 }, { unique: true });
export type ServiceDocument = Service & Document;
