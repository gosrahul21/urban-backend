import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {

  @Prop({
    unique: true,
    sparse: true
  })
  phoneNo?: string;

  @Prop({
    unique: true,
    sparse: true
  })
  email?: string;

  @Prop({
    default: false,
  })
  verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
