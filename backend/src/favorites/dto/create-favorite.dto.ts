import { FavoriteType } from "../../../generated/prisma/enums.js";

import { IsString, IsEnum, IsInt, Min, Max } from 'class-validator'

export class CreateFavoriteDto {

  @IsString()
  title!: string

  @IsString()
  imageUrl!: string

  @IsString()
  externalId!: string


  @IsInt()
  @Min(1)
  @Max(3)
  order!: number
  
}