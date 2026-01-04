import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { ServiceProviderStatus } from './service-provider.entity';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { GetProvidersByFilter } from './dto/get-providers-by-filter.dto';

@Controller('service-providers')
export class ServiceProviderController {
  constructor(
    private readonly serviceProviderService: ServiceProviderService,
  ) {}

  // Create provider
  @Post()
  createServiceProvider(
    @Body()
    body: CreateServiceProviderDto,
  ) {
    return this.serviceProviderService.createServiceProvider(body);
  }

  // Get by providerId
  @Get(':id')
  getServiceProviderById(@Param('id') id: string) {
    return this.serviceProviderService.getServiceProviderById(id);
  }

  // Get by userId
  @Get()
  getByUserId(@Query('userId') userId: string) {
    return this.serviceProviderService.getByUserId(userId);
  }

  // Get providers by service
  @Get('by-service/:serviceId')
  getProvidersByService(
    @Param('serviceId') serviceId: string,
    @Query('status') status?: ServiceProviderStatus,
  ) {
    return this.serviceProviderService.getProvidersByService(serviceId, status);
  }

  // Update provider services
  @Patch(':id/services')
  updateServices(
    @Param('id') id: string,
    @Body() body: UpdateServiceProviderDto,
  ) {
    return this.serviceProviderService.updateServices(id, body.serviceIds!);
  }

  // Update provider status (realtime)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ServiceProviderStatus },
  ) {
    return this.serviceProviderService.updateStatus(id, body.status);
  }

  // Deactivate provider
  @Patch(':id/deactivate')
  deactivateProvider(@Param('id') id: string) {
    return this.serviceProviderService.deactivateProvider(id);
  }

  // Get providers by filter
  @Post('by-filter')
  getProvidersByFilter(@Body() body: GetProvidersByFilter) {
    return this.serviceProviderService.getProvidersByFilter(body);
  }
}
