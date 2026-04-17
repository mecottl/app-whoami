import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator'
import { Template, Layout } from '../../../generated/prisma/enums.js'

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
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
}
