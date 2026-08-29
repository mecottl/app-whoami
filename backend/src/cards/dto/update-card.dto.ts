import { IsOptional, IsString, IsDateString, IsEnum, MaxLength } from 'class-validator'
import { Template, Layout } from '../../../generated/prisma/enums.js'

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(700)
  description?: string

  @IsOptional()
  @IsDateString()
  birthDate?: string

  @IsOptional()
  @IsEnum(Template)
  template?: Template

  @IsOptional()
  @IsEnum(Layout)
  layout?: Layout

  @IsOptional()
  @IsString()
  @MaxLength(9)
  favoriteColor?: string

  @IsOptional()
  @IsString()
  @MaxLength(30)
  handle?: string

  @IsOptional()
  @IsString()
  @MaxLength(40)
  location?: string

  @IsOptional()
  @IsString()
  @MaxLength(700000) // permite una imagen pequeña embebida como data URL
  avatarUrl?: string
}
