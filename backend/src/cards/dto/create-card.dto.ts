import { IsString, IsOptional, IsDateString, IsEnum, MaxLength } from 'class-validator'
import { Template, Layout } from "../../../generated/prisma/enums.js"

export class CreateCardDto {
  @IsString()
  @MaxLength(80)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(180)
  description?: string

  @IsOptional()
  @IsDateString()
  birthDate?: string

  @IsEnum(Template)
  template!: Template

  @IsEnum(Layout)
  layout!: Layout
}
