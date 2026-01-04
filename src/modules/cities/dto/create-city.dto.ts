import { IsNotEmpty, IsNumberString, IsString } from '@nestjs/class-validator';

export class CreateCityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumberString()
    @IsNotEmpty()
    zipCode: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}