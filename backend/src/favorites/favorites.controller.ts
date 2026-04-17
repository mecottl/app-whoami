import { Controller, Post, Param, Body, Get, Delete, Patch } from '@nestjs/common'
import { FavoritesService } from './favorites.service.js'
import { CreateFavoriteDto } from './dto/create-favorite.dto.js'
import { UpdateOrderDto } from './dto/update-favorite.dto.js'


@Controller('cards/:cardId/favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Post()
    create(
        @Param('cardId') cardId: string,
        @Body() dto: CreateFavoriteDto
    ) {
        return this.favoritesService.create(cardId, dto)
    }

    @Get()
    findByCard(
        @Param('cardId') cardId: string
    ) {
        return this.favoritesService.findByCard(cardId)
    }

    @Patch(':id/order')
    updateOrder(
        @Param('id') id: string,
        @Body() dto: UpdateOrderDto
    ) {
        return this.favoritesService.updateOrder(id, dto.order)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.favoritesService.remove(id)
    }
}
