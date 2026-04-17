import { IsInt, Min, Max } from 'class-validator'

export class UpdateOrderDto {
  @IsInt()
  @Min(1)
  @Max(3)
  order!: number
}