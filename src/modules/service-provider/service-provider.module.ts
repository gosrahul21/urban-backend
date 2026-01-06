import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceProviderService } from './service-provider.service';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from './service-provider.entity';
import { ServiceProviderController } from './service-provider.controller';
import {
  ServiceProviderAvailability,
  ServiceProviderAvailabilitySchema,
} from './entities/service-provider-availability.entity';
import { ServiceProviderAvailabilityService } from './service-provider-avail.service';
import { ServiceProviderAvailabilityController } from './service-provider-avail.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ServiceProvider.name,
        schema: ServiceProviderSchema,
      },
      {
        name: ServiceProviderAvailability.name,
        schema: ServiceProviderAvailabilitySchema,
      },
    ]),
  ],
  controllers: [
    ServiceProviderController,
    ServiceProviderAvailabilityController,
  ],
  providers: [ServiceProviderService, ServiceProviderAvailabilityService],
  exports: [ServiceProviderService],
})
export class ServiceProviderModule {}
