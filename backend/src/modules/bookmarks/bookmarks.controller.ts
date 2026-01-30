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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { QueryBookmarkDto } from './dto/query-bookmark.dto';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new bookmark with ML classification',
    description:
      'Creates a bookmark and automatically classifies it using ML. ' +
      'The ML service analyzes the URL, title, and description to assign a category, ' +
      'confidence score, and suggest relevant tags.',
  })
  @ApiResponse({
    status: 201,
    description: 'Bookmark successfully created with ML classification',
    schema: {
      example: {
        id: '26cc4115-d8cf-480a-9724-c7d08a25a7db',
        url: 'https://github.com/nestjs/nest',
        title: 'NestJS Framework',
        description: 'A progressive Node.js framework',
        favicon: null,
        isFavorite: false,
        mlCategory: 'technology',
        mlConfidence: '85.00',
        userId: '82790be0-cdca-4084-845c-0420ff71e703',
        tags: [
          { id: '6e481ba4-e317-4988-966e-b3d9038743c8', name: 'nodejs', color: '#6366f1' },
          { id: '7120801c-f37a-49a7-95cb-a37ea128b372', name: 'github', color: '#6366f1' },
          { id: '0746e2b1-68b6-46b0-9ae4-3103b27e4ed1', name: 'nestjs', color: '#6366f1' },
        ],
        createdAt: '2026-01-30T14:21:29.463Z',
        updatedAt: '2026-01-30T14:21:29.463Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all bookmarks with filtering and pagination',
    description:
      'Retrieve bookmarks with optional filters for category, tags, favorites, and search. ' +
      'Supports pagination with configurable page size.',
  })
  @ApiQuery({ name: 'userId', required: true, description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({
    status: 200,
    description: 'List of bookmarks with pagination info',
    schema: {
      example: {
        data: [
          {
            id: '26cc4115-d8cf-480a-9724-c7d08a25a7db',
            url: 'https://github.com/nestjs/nest',
            title: 'NestJS Framework',
            description: 'A progressive Node.js framework',
            favicon: null,
            isFavorite: false,
            mlCategory: 'technology',
            mlConfidence: '85.00',
            userId: '82790be0-cdca-4084-845c-0420ff71e703',
            tags: [
              { id: '6e481ba4-e317-4988-966e-b3d9038743c8', name: 'nodejs', color: '#6366f1' },
              { id: '7120801c-f37a-49a7-95cb-a37ea128b372', name: 'github', color: '#6366f1' },
            ],
            createdAt: '2026-01-30T14:21:29.463Z',
            updatedAt: '2026-01-30T14:21:29.463Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  findAll(@Query('userId') userId: string, @Query() query: QueryBookmarkDto) {
    return this.bookmarksService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bookmark by ID' })
  @ApiParam({ name: 'id', description: 'Bookmark UUID', example: '26cc4115-d8cf-480a-9724-c7d08a25a7db' })
  @ApiQuery({ name: 'userId', required: true, description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({
    status: 200,
    description: 'Bookmark found',
    schema: {
      example: {
        id: '26cc4115-d8cf-480a-9724-c7d08a25a7db',
        url: 'https://github.com/nestjs/nest',
        title: 'NestJS Framework',
        mlCategory: 'technology',
        mlConfidence: '85.00',
        tags: [{ name: 'nodejs' }, { name: 'github' }],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Bookmark not found or access denied' })
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.bookmarksService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bookmark' })
  @ApiParam({ name: 'id', description: 'Bookmark UUID', example: '26cc4115-d8cf-480a-9724-c7d08a25a7db' })
  @ApiQuery({ name: 'userId', required: true, description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({
    status: 200,
    description: 'Bookmark successfully updated',
    schema: {
      example: {
        id: '26cc4115-d8cf-480a-9724-c7d08a25a7db',
        url: 'https://github.com/nestjs/nest',
        title: 'Updated Title',
        isFavorite: true,
        mlCategory: 'technology',
        mlConfidence: '85.00',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Bookmark not found or access denied' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(id, userId, updateBookmarkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a bookmark' })
  @ApiParam({ name: 'id', description: 'Bookmark UUID', example: '26cc4115-d8cf-480a-9724-c7d08a25a7db' })
  @ApiQuery({ name: 'userId', required: true, description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({ status: 204, description: 'Bookmark successfully deleted' })
  @ApiResponse({ status: 404, description: 'Bookmark not found or access denied' })
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.bookmarksService.remove(id, userId);
  }

  @Post(':id/tags')
  @ApiOperation({
    summary: 'Add a tag to a bookmark',
    description: 'Add a single tag to an existing bookmark. Creates the tag if it does not exist.',
  })
  @ApiParam({ name: 'id', description: 'Bookmark UUID', example: '26cc4115-d8cf-480a-9724-c7d08a25a7db' })
  @ApiQuery({ name: 'userId', required: true, description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({
    status: 200,
    description: 'Tag successfully added',
    schema: {
      example: {
        id: '26cc4115-d8cf-480a-9724-c7d08a25a7db',
        tags: [
          { name: 'nodejs' },
          { name: 'github' },
          { name: 'typescript' },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Bookmark not found or access denied' })
  addTag(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body('tagName') tagName: string,
  ) {
    return this.bookmarksService.addTag(id, userId, tagName);
  }

  @Delete(':id/tags/:tagId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a tag from a bookmark' })
  @ApiParam({ name: 'id', description: 'Bookmark UUID', example: '26cc4115-d8cf-480a-9724-c7d08a25a7db' })
  @ApiParam({ name: 'tagId', description: 'Tag UUID', example: '6e481ba4-e317-4988-966e-b3d9038743c8' })
  @ApiQuery({ name: 'userId', required: true, description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({
    status: 200,
    description: 'Tag successfully removed',
    schema: {
      example: {
        id: '26cc4115-d8cf-480a-9724-c7d08a25a7db',
        tags: [{ name: 'nodejs' }],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Bookmark not found or access denied' })
  removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Query('userId') userId: string,
  ) {
    return this.bookmarksService.removeTag(id, userId, tagId);
  }
}
