import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Types } from 'mongoose';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createUserDetails(
    @Body()
    payload: {
      firstName: string;
      lastName: string;
    },
    @Req() req,
  ) {
    const userId = req.user.id;
    console.log({ ...payload, userId });
    return this.userDetailsService.createUserDetails({
      ...payload,
      userId: new Types.ObjectId(userId),
    });
  }

  @Get(':userId')
  getUserDetails(@Param('userId') userId: string) {
    return this.userDetailsService.getUserDetailsByUserId(userId);
  }
}
