import { IsInt, Min } from 'class-validator'

export class UpdateCategoryOrderDto {
  @IsInt()
  @Min(1)
  order!: number
}
