import { Injectable } from "@nestjs/common";
import { prisma } from "../../lib/prisma.js"
import { CreateCardDto } from "./dto/create-card.dto.js";
import { UpdateCardDto } from "./dto/update-card.dto.js";
import { Template, Layout } from "../../generated/prisma/enums.js";
import { NotFoundException } from '@nestjs/common'

@Injectable()
export class CardsService {
    create(userId: string, dto: CreateCardDto) {
        return prisma.card.create({
            data: {
                ...dto,
                birthDate: new Date(dto.birthDate), 
                template: dto.template as Template,
                layout: dto.layout as Layout,
                userId
            }
        })
    }

    findAll(userId: string) {
        return prisma.card.findMany({
            where: { userId }
        })
    }

    async findOne(userId: string, id: string) {
        const card = await prisma.card.findFirst({
            where: { userId, id}
        })
        if (!card) {
            throw new NotFoundException('Card not found')
        }
        return card
    }

    async update(userId: string, id: string, dto: UpdateCardDto) {
        return await prisma.card.update({
            where: {id, userId},
            data: {
                ...dto,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
                template: dto.template as Template,
                layout: dto.layout as Layout
            }
        })
    }

    async remove(userId: string, id: string) {
        return await prisma.card.delete({
            where: { id, userId}
        })
    }
}
