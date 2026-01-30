import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'Tag successfully created',
    schema: {
      example: {
        id: '6e481ba4-e317-4988-966e-b3d9038743c8',
        name: 'nodejs',
        color: '#6366f1',
        createdAt: '2026-01-30T14:21:29.449Z',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Tag with this name already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: 200,
    description: 'List of all tags',
    schema: {
      example: [
        {
          id: '6e481ba4-e317-4988-966e-b3d9038743c8',
          name: 'nodejs',
          color: '#6366f1',
          createdAt: '2026-01-30T14:21:29.449Z',
        },
        {
          id: '7120801c-f37a-49a7-95cb-a37ea128b372',
          name: 'github',
          color: '#6366f1',
          createdAt: '2026-01-30T14:21:29.449Z',
        },
      ],
    },
  })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag UUID', example: '6e481ba4-e317-4988-966e-b3d9038743c8' })
  @ApiResponse({
    status: 200,
    description: 'Tag found',
    schema: {
      example: {
        id: '6e481ba4-e317-4988-966e-b3d9038743c8',
        name: 'nodejs',
        color: '#6366f1',
        bookmarks: [],
        createdAt: '2026-01-30T14:21:29.449Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({ name: 'id', description: 'Tag UUID', example: '6e481ba4-e317-4988-966e-b3d9038743c8' })
  @ApiResponse({
    status: 200,
    description: 'Tag successfully updated',
    schema: {
      example: {
        id: '6e481ba4-e317-4988-966e-b3d9038743c8',
        name: 'typescript',
        color: '#3178c6',
        createdAt: '2026-01-30T14:21:29.449Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 409, description: 'Tag with this name already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'id', description: 'Tag UUID', example: '6e481ba4-e317-4988-966e-b3d9038743c8' })
  @ApiResponse({ status: 204, description: 'Tag successfully deleted' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
