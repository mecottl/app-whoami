import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js"
import { CreateCardDto } from "./dto/create-card.dto.js";
import { UpdateCardDto } from "./dto/update-card.dto.js";
import { UsersService } from "../users/users.service.js";

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

        return this.prisma.card.create({
            data: {
                name: dto.name,
                description: dto.description,
                birthDate: birth,
                template: dto.template,
                layout: dto.layout,
                userId,
            }
        })
    }

    findAll(userId: string) {
        return this.prisma.card.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
    }

    async findOne(userId: string, id: string) {
        const card = await this.prisma.card.findFirst({ where: { id, userId } })
        if (!card) throw new NotFoundException('Card not found')
        return card
    }

    async update(userId: string, id: string, dto: UpdateCardDto) {
        await this.findOne(userId, id)

        return this.prisma.card.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                favoriteColor: dto.favoriteColor,
                avatarUrl: dto.avatarUrl,
                template: dto.template,
                layout: dto.layout,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            },
        })
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id)

        return this.prisma.card.delete({ where: { id } })
    }
}
