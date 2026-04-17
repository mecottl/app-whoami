import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator'
import { Template, Layout } from "../../../generated/prisma/enums.js"

export class CreateProfileDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description!: string

  @IsDateString()
  birthDate!: string

  @IsEnum(Template)
  template!: Template

  @IsEnum(Layout)
  layout!: Layout
}