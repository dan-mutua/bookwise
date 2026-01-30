import {
  IsString,
  IsUrl,
  IsOptional,
  IsArray,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookmarkDto {
  @ApiPropertyOptional({
    description: 'New URL for the bookmark',
    example: 'https://github.com/nestjs/nest',
    maxLength: 2048,
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(2048)
  url?: string;

  @ApiPropertyOptional({
    description: 'New title for the bookmark',
    example: 'NestJS - Progressive Node.js Framework',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'New description',
    example: 'Updated description of the bookmark',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'New favicon URL',
    example: 'https://github.com/favicon.ico',
  })
  @IsString()
  @IsOptional()
  favicon?: string;

  @ApiPropertyOptional({
    description: 'Toggle favorite status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @ApiPropertyOptional({
    description: 'Replace tags (replaces all existing tags)',
    example: ['nodejs', 'typescript', 'framework'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
