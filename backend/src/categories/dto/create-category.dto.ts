import { IsEnum, IsString, MaxLength } from 'class-validator'
import { FavoriteType } from '../../../generated/prisma/enums.js'

export class CreateCategoryDto {
  @IsString()
  @MaxLength(60)
  name!: string

  @IsEnum(FavoriteType)
  type!: FavoriteType
}
