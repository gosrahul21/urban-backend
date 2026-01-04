import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceType } from './device.entity';
import { Model } from 'mongoose';

export class DeviceService {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceType>,
  ) {}
  async registerDevice(deviceRegisterationData: {
    userId: string;
    deviceToken: string;
  }) {
    // find any device with existing deviceToken, if yes delete that token
    // devalidate its refreshToken as well if required

    await this.deviceModel.findOneAndDelete({
      deviceToken: deviceRegisterationData.deviceToken,
    });
    await this.deviceModel.findOneAndDelete({
      userId: deviceRegisterationData.userId,
    });
    const newDevice = await this.deviceModel.create({
      userId: deviceRegisterationData.userId,
      deviceToken: deviceRegisterationData.deviceToken,
    });

    return newDevice.toJSON();
  }

  async deleteDeviceForUser(userId: string) {
    const device = await this.deviceModel
      .findOneAndDelete({
        userId,
      })
      .lean();
    return {
      deleted: !!device,
    };
  }
}
