import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, Types } from 'mongoose';
import { SubCategory, SubCategoryDocument } from './sub-category.entity';
import { CreateServiceDto } from '../services/dto/create-service.dto';
import { UpdateServiceDto } from '../services/dto/update-service.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
  
  @Injectable()
  export class SubCategoryService {
    constructor(
      @InjectModel(SubCategory.name)
      private readonly subCategoryModel: Model<SubCategoryDocument>,
    ) {}
  
    async create(dto: CreateSubCategoryDto) {
      try {
        return await this.subCategoryModel.create({
          ...dto,
          categoryId: new Types.ObjectId(dto.categoryId),
        });
      } catch (err) {
        if (err.code === 11000) {
          throw new ConflictException(
            'Service already exists in this category',
          );
        }
        throw err;
      }
    }
  
    async findAll() {
      return this.subCategoryModel
        .find()
        .populate('categoryId', 'name')
        .lean();
    }
  
    async findByCategory(categoryId: string) {
      return this.subCategoryModel
        .find({ categoryId: new Types.ObjectId(categoryId) })
        .populate('categoryId', 'name')
        .lean();
    }
  
    async findOne(id: string) {
      const subCategory = await this.subCategoryModel
        .findById(id)
        .populate('categoryId', 'name')
        .lean();
  
      if (!subCategory) throw new NotFoundException('Service not found');
      return subCategory;
    }
  
    async update(id: string, dto: UpdateServiceDto) {
      const subCategory = await this.subCategoryModel.findByIdAndUpdate(
        id,
        {
          ...dto,
          ...(dto.categoryId && {
            categoryId: new Types.ObjectId(dto.categoryId),
          }),
        },
        { new: true },
      );
  
      if (!subCategory) throw new NotFoundException('subCategory not found');
      return subCategory;
    }
  
    async remove(id: string) {
      const subCategory = await this.subCategoryModel.findByIdAndDelete(id);
      if (!subCategory) throw new NotFoundException('subCategory not found');
      return { message: 'subCategory deleted successfully' };
    }
  }
  