import { IsString, MaxLength } from 'class-validator'

export class CreateFavoriteDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsString()
  imageUrl!: string

  @IsString()
  externalId!: string
}
