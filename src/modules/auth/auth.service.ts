import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.entity';
import { Model } from 'mongoose';
import { UserDetailsService } from '../user-details/user-details.service';

@Injectable()
export class AuthService {
  private readonly DEMO_OTP = '123456';

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userDetailService: UserDetailsService,
  ) {}

  // STEP 1: Request OTP
  requestOtp(phoneNo: string) {
    // TODO: store OTP in Redis with expiry
    return {
      message: 'OTP sent successfully',
    };
  }

  // STEP 2: Verify OTP (LOGIN + SIGNUP)
  async verifyOtp(data: { phoneNo: string; otp: string }) {
    if (data.otp !== this.DEMO_OTP) {
      throw new UnauthorizedException('Invalid OTP');
    }

    let user = await this.getUserByPhone(data.phoneNo);
    let isNewUser = false;
    let userDetails;
    // Auto-signup if user does not exist
    if (!user) {
      user = await this.createUser({
        phoneNo: data.phoneNo,
      });
      isNewUser = true;
    } else {
      userDetails = await this.userDetailService.getUserDetailsByUserId(
        user._id,
      );
      if (!userDetails) isNewUser = true;
    }

    // Mark verified if not verified
    if (!user.verified) {
      await this.verifyUser(user._id);
      user.verified = true;
    }

    const payload = this.buildJwtPayload(user);
    const tokens = this.generateToken(payload);

    return {
      ...tokens,
      user: isNewUser ? null : userDetails,
    };
  }

  async createUser(userData) {
    return await this.userModel.create(userData);
  }

  async getUserByPhone(phoneNo) {
    const user = await this.userModel.findOne({ phoneNo }).lean();
    // if (!user) throw new NotFoundException('NO user found');
    return user;
  }

  async verifyUser(userId) {
    await this.userModel.findByIdAndUpdate(userId, {
      verified: true,
    });
  }

  // JWT payload
  private buildJwtPayload(user: any) {
    return {
      id: user._id,
      email: user.email,
      phoneNo: user.phoneNo,
      verified: user.verified,
    };
  }

  // Token generation
  private generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // Refresh token flow
  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userModel.findById(decoded.id).lean();

      if (!user) throw new ForbiddenException('User not found');
      const userDetails = await this.userDetailService.getUserDetailsByUserId(
        user._id,
      );
      return {
        ...this.generateToken(this.buildJwtPayload(user)),
        user: userDetails,
      };
    } catch (err) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
