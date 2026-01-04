import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(payload: {
    name: string;
    description: string;
  }) {
    const category = new this.categoryModel(payload);
    return category.save();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryModel.findById(id).lean();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getCategories(pageNo = 1, limit = 10) {
    const skip = (pageNo - 1) * limit;

    const [data, total] = await Promise.all([
      this.categoryModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.categoryModel.countDocuments(),
    ]);

    return {
      data,
      pagination: {
        pageNo,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateCategory(
    id: string,
    payload: Partial<{ name: string; description: string }>,
  ) {
    const updated = await this.categoryModel.findByIdAndUpdate(
      id,
      payload,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Category not found');
    }

    return updated;
  }

  async deleteCategory(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
