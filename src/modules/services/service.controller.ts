import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  createService(
    @Body()
    body: CreateServiceDto,
  ) {
    return this.serviceService.createService(body);
  }

  @Get('all')
  getAllServices() {
    return this.serviceService.getServices({});
  }

  @Get(':id')
  getServiceById(@Param('id') id: string) {
    return this.serviceService.getServiceById(id);
  }

  @Get()
  getServicesByCategory(
    @Query('categoryId') categoryId: string,
    @Query('pageNo') pageNo = '1',
    @Query('limit') limit = '10',
  ) {
    return this.serviceService.getServicesByCategory(
      categoryId,
      Number(pageNo),
      Number(limit),
    );
  }

  @Patch(':id')
  updateService(
    @Param('id') id: string,
    @Body()
    body: UpdateServiceDto,
  ) {
    return this.serviceService.updateService(id, body);
  }

  @Delete(':id')
  deleteService(@Param('id') id: string) {
    return this.serviceService.deleteService(id);
  }
}
