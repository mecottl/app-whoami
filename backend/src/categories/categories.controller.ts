import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { CategoriesService } from './categories.service.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { CreateCategoryDto } from './dto/create-category.dto.js'
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto.js'

@UseGuards(JwtAuthGuard)
@Controller('cards/:cardId/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Req() req: any,
    @Param('cardId') cardId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(req.user.userId, cardId, dto)
  }

  @Get()
  findByCard(@Req() req: any, @Param('cardId') cardId: string) {
    return this.categoriesService.findByCard(req.user.userId, cardId)
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.categoriesService.remove(req.user.userId, id)
  }

  @Patch(':id/order')
  updateOrder(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryOrderDto,
  ) {
    return this.categoriesService.updateOrder(req.user.userId, id, dto.order)
  }
}
