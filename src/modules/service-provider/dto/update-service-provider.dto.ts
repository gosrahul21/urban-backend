// update-service-provider.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProviderDto } from './create-service-provider.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateServiceProviderDto extends PartialType(CreateServiceProviderDto) {
  // We add 'lastOnlineAt' here because it might be updated manually 
  // or by a specific "heartbeat" endpoint, though often handled internally.
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastOnlineAt?: Date;
}