import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.entity';

@Schema({ timestamps: true })
export class SubCategory extends Document {
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
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
    index: true,
  })
  categoryId: Types.ObjectId;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
SubCategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });
export type SubCategoryDocument = SubCategory & Document;
