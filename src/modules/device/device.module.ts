import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './device.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExpoPushService } from 'src/common/services/expo.service';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService, ExpoPushService],
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    JwtModule,
  ],
  exports: [DeviceService],
})
export class DeviceModule {}
