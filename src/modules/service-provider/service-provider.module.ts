import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceProviderService } from './service-provider.service';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from './service-provider.entity';
import { ServiceProviderController } from './service-provider.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ServiceProvider.name,
        schema: ServiceProviderSchema,
      },
    ]),
  ],
  controllers: [ServiceProviderController],
  providers: [ServiceProviderService],
  exports: [ServiceProviderService],
})
export class ServiceProviderModule {}
