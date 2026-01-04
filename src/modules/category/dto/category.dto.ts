import { IsArray, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  imageUrls: string[];
}
