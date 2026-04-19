import { Controller, Post, Param, Body, Get, Delete, Patch } from '@nestjs/common'
import { CategoriesService } from './categories.service.js'

@Controller('cards/:cardId/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Param('cardId') cardId: string,
    @Body() dto: any
  ) {
    return this.categoriesService.create(cardId, dto)
  }

  @Get()
  findByCard(@Param('cardId') cardId: string) {
    return this.categoriesService.findByCard(cardId)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id)
  }

  @Patch(':id/order')
  updateOrder(
    @Param('id') id: string,
    @Body() dto: any
  ) {
    return this.categoriesService.updateOrder(id, dto.order)
  }
}