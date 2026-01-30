import {
  IsString,
  IsUrl,
  IsOptional,
  IsArray,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class UpdateBookmarkDto {
  @IsUrl()
  @IsOptional()
  @MaxLength(2048)
  url?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  favicon?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
