import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { QueryBookmarkDto } from './dto/query-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @Get()
  findAll(@Query('userId') userId: string, @Query() query: QueryBookmarkDto) {
    return this.bookmarksService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.bookmarksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(id, userId, updateBookmarkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.bookmarksService.remove(id, userId);
  }

  @Post(':id/tags')
  addTag(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body('tagName') tagName: string,
  ) {
    return this.bookmarksService.addTag(id, userId, tagName);
  }

  @Delete(':id/tags/:tagId')
  @HttpCode(HttpStatus.OK)
  removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Query('userId') userId: string,
  ) {
    return this.bookmarksService.removeTag(id, userId, tagId);
  }
}
