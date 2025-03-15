import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../entities/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() category: Category): Promise<Category> {
    return this.categoryService.update(id, category);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}

