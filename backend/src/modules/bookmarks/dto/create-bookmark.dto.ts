import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsArray,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'The URL to bookmark',
    example: 'https://github.com/nestjs/nest',
    maxLength: 2048,
  })
  @IsUrl()
  @IsNotEmpty()
  @MaxLength(2048)
  url: string;

  @ApiProperty({
    description: 'Title of the bookmark',
    example: 'NestJS Framework - A progressive Node.js framework',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description of the bookmark',
    example: 'A progressive Node.js framework for building efficient and scalable server-side applications',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL to the favicon',
    example: 'https://github.com/favicon.ico',
  })
  @IsString()
  @IsOptional()
  favicon?: string;

  @ApiPropertyOptional({
    description: 'Mark bookmark as favorite',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @ApiPropertyOptional({
    description: 'User-provided tags (additional ML-suggested tags will be added automatically)',
    example: ['nodejs', 'backend'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'ID of the user creating the bookmark',
    example: '82790be0-cdca-4084-845c-0420ff71e703',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
