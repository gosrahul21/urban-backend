// create-service-provider.dto.ts
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ServiceProviderStatus } from '../service-provider.entity';

export class CreateServiceProviderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsMongoId({ each: true }) // Validates that every item in the array is a MongoId
  @IsNotEmpty()
  serviceIds: string[];

  @IsMongoId()
  @IsNotEmpty()
  cityId: string;

  @IsEnum(ServiceProviderStatus)
  @IsOptional()
  status?: ServiceProviderStatus;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
