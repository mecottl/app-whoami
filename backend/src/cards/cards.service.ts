import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js"
import { CreateCardDto } from "./dto/create-card.dto.js";
import { UpdateCardDto } from "./dto/update-card.dto.js";
import { UsersService } from "../users/users.service.js";

// La edad se calcula desde User.birthDate; se adjunta a la card en las
// respuestas para que el frontend no tenga que pedir el perfil aparte.

@Injectable()
export class CardsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usersService: UsersService,
    ) {}

    async create(userId: string, dto: CreateCardDto) {
        const user = await this.usersService.findById(userId)
        let birth = user?.birthDate ?? null

        if (dto.birthDate) {
            birth = new Date(dto.birthDate)
            // guarda la fecha en el perfil si aún no la tenía
            if (user && !user.birthDate) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { birthDate: birth },
                })
            }
        }

        if (!birth) {
            throw new BadRequestException('Falta la fecha de nacimiento')
        }

        const card = await this.prisma.card.create({
            data: {
                name: dto.name,
                description: dto.description,
                template: dto.template,
                layout: dto.layout,
                userId,
            }
        })
        return { ...card, birthDate: birth }
    }

    async findAll(userId: string) {
        const user = await this.usersService.findById(userId)
        const cards = await this.prisma.card.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            include: {
                categories: {
                    orderBy: { order: "asc" },
                    include: { favorites: { orderBy: { order: "asc" } } },
                },
            },
        })
        return cards.map((c) => ({ ...c, birthDate: user?.birthDate ?? null }))
    }

    async findOne(userId: string, id: string) {
        const card = await this.prisma.card.findFirst({ where: { id, userId } })
        if (!card) throw new NotFoundException('Card not found')
        const user = await this.usersService.findById(userId)
        return { ...card, birthDate: user?.birthDate ?? null }
    }

    async update(userId: string, id: string, dto: UpdateCardDto) {
        await this.findOne(userId, id)

        // birthDate ahora vive en el perfil del usuario, no en la card
        let birth: Date | null = null
        if (dto.birthDate) {
            birth = new Date(dto.birthDate)
            await this.prisma.user.update({
                where: { id: userId },
                data: { birthDate: birth },
            })
        }

        const card = await this.prisma.card.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                favoriteColor: dto.favoriteColor,
                avatarUrl: dto.avatarUrl,
                handle: dto.handle,
                location: dto.location,
                template: dto.template,
                layout: dto.layout,
            },
        })

        if (!birth) {
            const user = await this.usersService.findById(userId)
            birth = user?.birthDate ?? null
        }
        return { ...card, birthDate: birth }
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id)

        return this.prisma.card.delete({ where: { id } })
    }
}
