import { BadRequestException, Injectable } from '@nestjs/common'
import { prisma } from '../../lib/prisma.js'

@Injectable()
export class CategoriesService {

  async create(cardId: string, data: any) {
    const last = await prisma.cardCategory.findFirst({
      where: { cardId },
      orderBy: { order: 'desc' }
    })

    const nextOrder = last ? last.order + 1 : 1

    return prisma.cardCategory.create({
      data: {
        ...data,
        cardId,
        order: nextOrder
      }
    })
  }

  async findByCard(cardId: string) {
    return prisma.cardCategory.findMany({
      where: { cardId },
      include: {
        favorites: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })
  }

  async remove(id: string) {
    return prisma.cardCategory.delete({
      where: { id }
    })
  }

  async updateOrder(id: string, order: number) {
    const category = await prisma.cardCategory.findUnique({
      where: { id }
    })

    if (!category) {
      throw new BadRequestException('Category not found')
    }

    const target = await prisma.cardCategory.findFirst({
      where: {
        cardId: category.cardId,
        order
      }
    })

    if (target) {
      await prisma.cardCategory.update({
        where: { id: target.id },
        data: { order: category.order }
      })
    }

    return prisma.cardCategory.update({
      where: { id },
      data: { order }
    })
  }
}