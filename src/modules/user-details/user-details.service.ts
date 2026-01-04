import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDetails, UserDetailType } from './user-details.entity';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectModel(UserDetails.name)
    private readonly userDetailsModel: Model<UserDetailType>,
  ) {}

  async createUserDetails(payload: {
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
  }) {
    // check if user already exist

    return await this.userDetailsModel.create({ ...payload });
  }

  async getUserDetailsByPhoneNo(phoneNo: string) {
    const userDetails = this.userDetailsModel.findOne({ phoneNo });
    if (!userDetails) throw new NotFoundException('User details not found');
    return userDetails;
  }

  async getUserDetailsByUserId(userId) {
    const user = await this.userDetailsModel.findOne({ userId });
    return user;
  }

  async verifyUser(userId: Types.ObjectId) {
    const user = await this.userDetailsModel
      .findByIdAndUpdate(userId, { verified: true })
      .lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
