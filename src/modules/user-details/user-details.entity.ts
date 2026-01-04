import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../auth/user.entity';

@Schema({ timestamps: true })
export class UserDetails extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: Date,
    required: false,
  })
  dob: string;

  @Prop({
    default: 'pending',
  })
  kycStatus: string;

  @Prop({
    type: [String],
    required: false,
  })
  savedAddresses: string[];
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);
export type UserDetailType = UserDetails & Document;
