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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      example: {
        id: '82790be0-cdca-4084-845c-0420ff71e703',
        email: 'john.doe@example.com',
        name: 'John Doe',
        createdAt: '2026-01-30T14:21:21.435Z',
        updatedAt: '2026-01-30T14:21:21.435Z',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      example: [
        {
          id: '82790be0-cdca-4084-845c-0420ff71e703',
          email: 'john.doe@example.com',
          name: 'John Doe',
          createdAt: '2026-01-30T14:21:21.435Z',
          updatedAt: '2026-01-30T14:21:21.435Z',
        },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      example: {
        id: '82790be0-cdca-4084-845c-0420ff71e703',
        email: 'john.doe@example.com',
        name: 'John Doe',
        bookmarks: [],
        createdAt: '2026-01-30T14:21:21.435Z',
        updatedAt: '2026-01-30T14:21:21.435Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    schema: {
      example: {
        id: '82790be0-cdca-4084-845c-0420ff71e703',
        email: 'john.doe@example.com',
        name: 'Jane Doe',
        createdAt: '2026-01-30T14:21:21.435Z',
        updatedAt: '2026-01-30T15:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User UUID', example: '82790be0-cdca-4084-845c-0420ff71e703' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
