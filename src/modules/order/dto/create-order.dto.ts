import { IsArray, IsMongoId, IsOptional, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  categoryId: string;

  @IsArray()
  serviceIds: string[];

  @IsMongoId()
  cityId: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
