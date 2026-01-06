import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceProviderModule } from './modules/service-provider/service-provider.module';
import { CategoryModule } from './modules/category/category.module';
import { CityModule } from './modules/cities/city.module';
import { ServiceModule } from './modules/services/service.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { UserDetailsModule } from './modules/user-details/user-details.module';
import { AuthModule } from './modules/auth/auth.module';
import { DeviceModule } from './modules/device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    CategoryModule,
    CityModule,
    ServiceModule,
    ServiceProviderModule,
    UserDetailsModule,
    DeviceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
