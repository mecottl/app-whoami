import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Req } from "@nestjs/common";
import { CardsService } from "./cards.service.js";
import { CreateCardDto } from "./dto/create-card.dto.js";
import { UpdateCardDto } from "./dto/update-card.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@UseGuards(JwtAuthGuard)
@Controller("cards")
export class CardsController {
    constructor (private readonly cardsService: CardsService){}

    @Post()
    create(@Req() req: any, @Body() dto: CreateCardDto) {
        return this.cardsService.create(req.user.userId, dto)
    }

    @Get()
    findAll(@Req() req: any) {
        return this.cardsService.findAll(req.user.userId)
    }

    @Get(":id")
    findOne(@Req() req: any, @Param("id") id: string) {
        return this.cardsService.findOne(req.user.userId, id)
    }

    @Patch(":id")
    update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateCardDto) {
        return this.cardsService.update(req.user.userId, id, dto)
    }

    @Delete(":id")
    remove(@Req() req: any, @Param("id") id: string) {
        return this.cardsService.remove(req.user.userId, id)
    }

}
