import { Controller, UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators/http';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeviceService } from './device.service';

@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  @Post('register-device')
  @UseGuards(AuthGuard)
  registerDevice(@Body() body) {
    return this.deviceService.registerDevice(body);
  }
}
