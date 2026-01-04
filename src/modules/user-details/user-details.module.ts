import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDetails, UserDetailsSchema } from './user-details.entity';
import { UserDetailsController } from './user-details.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {
        name: UserDetails.name,
        schema: UserDetailsSchema,
      },
    ]),
  ],
  controllers: [UserDetailsController],
  providers: [UserDetailsService],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
