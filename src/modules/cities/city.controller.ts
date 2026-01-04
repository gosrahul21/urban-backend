import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  createCity(@Body() body: CreateCityDto) {
    return this.cityService.createCity(body);
  }

  @Get(':id')
  getCityById(@Param('id') id: string) {
    return this.cityService.getCityById(id);
  }

  @Get()
  getCities(@Query('pageNo') pageNo = '1', @Query('limit') limit = '10') {
    return this.cityService.getCities(Number(pageNo), Number(limit));
  }

  @Patch(':id')
  updateCity(@Param('id') id: string, @Body() body: UpdateCityDto) {
    return this.cityService.updateCity(id, body);
  }

  @Delete(':id')
  deleteCity(@Param('id') id: string) {
    return this.cityService.deleteCity(id);
  }
}
