import { IsArray } from '@nestjs/class-validator';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceProviderStatus } from '../service-provider.entity';

export class GetProvidersByFilter {
  @IsMongoId()
  @IsNotEmpty()
  cityId: string;

  @IsArray()
  // @IsString();
  serviceIds: string[];

  @IsEnum(ServiceProviderStatus)
  @IsOptional()
  status: ServiceProviderStatus;
}
