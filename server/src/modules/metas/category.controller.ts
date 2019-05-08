import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { MetasService } from './metas.service';
import { MetasDto } from './metas.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
  constructor(private readonly metaService: MetasService) {}

  @Post()
  @UseGuards(AuthGuard())
  addCategory(@Body() dto: MetasDto) {
    return this.metaService.addMeta('category', dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  editCategory(@Param('id') id: number, @Body() dto: MetasDto) {
    return this.metaService.updateMeta('category', id, dto);
  }

  @Get()
  getCategorys() {
    return this.metaService.getMetas('category');
  }

  @Get(':id')
  getCategory(@Param('id') id: number) {
    return this.metaService.getMeta('category', id);
  }
}
