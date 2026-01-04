import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsMongoId()
  categoryId: string;
}
