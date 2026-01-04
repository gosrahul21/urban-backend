import { IsNumberString, IsOptional, IsString } from "@nestjs/class-validator";

export class UpdateCityDto  {
    
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    country: string;

    @IsOptional()
    @IsNumberString()
    zipCode: string;

    @IsOptional()
    @IsString()
    state: string;
}