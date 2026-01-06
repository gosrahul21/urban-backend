import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Req,
  } from '@nestjs/common';
  import { ServiceProviderAvailabilityService } from './service-provider-avail.service';
  
  @Controller('service-provider/availability')
  export class ServiceProviderAvailabilityController {
    constructor(
      private readonly availabilityService: ServiceProviderAvailabilityService,
    ) {}
  
    /**
     * Service Provider sets weekly availability
     */
    @Post()
    setAvailability(@Req() req, @Body() slots: any[]) {
      // req.user.id → serviceProviderId
      return this.availabilityService.setAvailability(req.user.id, slots);
    }
  
    /**
     * Service Provider views own availability
     */
    @Get()
    getAvailability(@Req() req) {
      return this.availabilityService.getAvailability(req.user.id);
    }
  
    /**
     * Clear all availability (go completely offline schedule-wise)
     */
    @Delete()
    deleteAvailability(@Req() req) {
      return this.availabilityService.deleteAvailability(req.user.id);
    }
  }
  