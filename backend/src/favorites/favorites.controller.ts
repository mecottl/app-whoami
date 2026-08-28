// src/favorites/favorites.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { FavoritesService } from './favorites.service.js'
import { CreateFavoriteDto } from './dto/create-favorite.dto.js'
import { UpdateOrderDto } from './dto/update-favorite.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'

@UseGuards(JwtAuthGuard)
@Controller('categories/:categoryId/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(
    @Req() req: any,
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateFavoriteDto,
  ) {
    return this.favoritesService.create(req.user.userId, categoryId, dto)
  }

  @Get()
  findByCategory(@Req() req: any, @Param('categoryId') categoryId: string) {
    return this.favoritesService.findByCategory(req.user.userId, categoryId)
  }

  @Patch('reorder')
  reorder(
    @Req() req: any,
    @Param('categoryId') categoryId: string,
    @Body() dto: { items: { id: string; order: number }[] },
  ) {
    return this.favoritesService.reorder(req.user.userId, categoryId, dto.items)
  }

  @Patch(':id/order')
  updateOrder(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.favoritesService.updateOrder(req.user.userId, id, dto.order)
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.favoritesService.remove(req.user.userId, id)
  }
}
