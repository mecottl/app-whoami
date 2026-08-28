import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateCategoryDto } from './dto/create-category.dto.js'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}


  private async assertCardOwner(userId: string, cardId: string) {
    const card = await this.prisma.card.findUnique({ where: { id: cardId } })
    if (!card) throw new NotFoundException('Card not found')
    if (card.userId !== userId) throw new ForbiddenException()
    return card
  }

  private async getOwnedCategory(userId: string, categoryId: string) {
    const category = await this.prisma.cardCategory.findUnique({
      where: { id: categoryId },
      include: { card: { select: { userId: true } } },
    })
    if (!category) throw new NotFoundException('Category not found')
    if (category.card.userId !== userId) throw new ForbiddenException()
    return category
  }

  async create(userId: string, cardId: string, dto: CreateCategoryDto) {
    await this.assertCardOwner(userId, cardId)

    const dup = await this.prisma.cardCategory.findFirst({
      where: { cardId, type: dto.type },
    })
    if (dup) {
      throw new ConflictException('Ya existe una categoría de ese tipo en esta card')
    }

    const last = await this.prisma.cardCategory.findFirst({
      where: { cardId },
      orderBy: { order: 'desc' },
    })

    const nextOrder = last ? last.order + 1 : 1

    return this.prisma.cardCategory.create({
      data: {
        name: dto.name,
        type: dto.type,
        cardId,
        order: nextOrder,
      },
    })
  }

  async findByCard(userId: string, cardId: string) {
    await this.assertCardOwner(userId, cardId)

    return this.prisma.cardCategory.findMany({
      where: { cardId },
      include: {
        favorites: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })
  }

  async remove(userId: string, categoryId: string) {
    await this.getOwnedCategory(userId, categoryId)

    return this.prisma.cardCategory.delete({
      where: { id: categoryId },
    })
  }

  async updateOrder(userId: string, categoryId: string, order: number) {
    const category = await this.getOwnedCategory(userId, categoryId)

    if (order === category.order) return category

    const target = await this.prisma.cardCategory.findFirst({
      where: { cardId: category.cardId, order },
    })

    return this.prisma.$transaction(async (tx) => {
      if (target) {
        await tx.cardCategory.update({
          where: { id: target.id },
          data: { order: category.order + 1000 },
        })
      }

      const moved = await tx.cardCategory.update({
        where: { id: categoryId },
        data: { order },
      })

      if (target) {
        await tx.cardCategory.update({
          where: { id: target.id },
          data: { order: category.order },
        })
      }

      return moved
    })
  }
}
