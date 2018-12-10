import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ArticleService } from '../service/article.service';
import { AuthGuard } from '@nestjs/passport';
import { UpDateArticleDto, CreateArticleDto } from '../dto/article.dto';
import { User } from 'src/common/decorators/user.decorator';
import { PaginationDto } from '../dto/pagination.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 文章列表
   */
  @Get('list')
  findAll(@User() user, @Query() dto: PaginationDto) {
    return this.articleService.findList(user ? '*' : 'online', dto);
  }

  /**
   * 返回文章详情
   */
  @Get(':aid')
  findOne(@Param('aid') aid) {
    return this.articleService.findOne(aid);
  }

  /**
   * 添加文章
   */
  @UseGuards(AuthGuard())
  @Post()
  create(@User('uid') uid, @Body() dto: CreateArticleDto) {
    return this.articleService.create(uid, dto);
  }

  /**
   * 更新文章
   */
  @UseGuards(AuthGuard())
  @Put(':aid')
  update(@Param('aid') aid, @Body() dto: UpDateArticleDto) {
    return this.articleService.update(aid, dto);
  }

  /**
   * 删除文章
   */
  @Delete(':aid')
  delete() {}
}
