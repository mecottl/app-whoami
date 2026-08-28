// src/favorites/favorites.service.ts

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class FavoritesService {

  constructor(private readonly prisma: PrismaService) {}


  private async assertCategoryOwner(userId: string, categoryId: string) {
    const category = await this.prisma.cardCategory.findUnique({
      where: { id: categoryId },
      include: { card: { select: { userId: true } } },
    })
    if (!category) throw new NotFoundException('Category not found')
    if (category.card.userId !== userId) throw new ForbiddenException()
    return category
  }

  private async getOwnedFavorite(userId: string, favoriteId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id: favoriteId },
      include: { category: { include: { card: { select: { userId: true } } } } },
    })
    if (!favorite) throw new NotFoundException('Favorite not found')
    if (favorite.category.card.userId !== userId) throw new ForbiddenException()
    return favorite
  }

  private readonly MAX_FAVORITES = 3

  async create(userId: string, categoryId: string, data: { title: string; imageUrl: string; externalId: string }) {
    await this.assertCategoryOwner(userId, categoryId)

    const { title, imageUrl, externalId } = data

    const current = await this.prisma.favorite.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
    })

    // Idempotente: si ya existe ese externalId, no se duplica
    const existing = current.find((f) => f.externalId === externalId)
    if (existing) return existing

    if (current.length >= this.MAX_FAVORITES) {
      throw new BadRequestException(`Maximo ${this.MAX_FAVORITES} favoritos por categoria`)
    }

    // Primer slot libre entre 1 y MAX
    const taken = new Set(current.map((f) => f.order))
    let order = 1
    while (taken.has(order)) order++

    return this.prisma.favorite.create({
      data: { title, imageUrl, externalId, order, categoryId },
    })
  }

  async findByCategory(userId: string, categoryId: string) {
    await this.assertCategoryOwner(userId, categoryId)

    return this.prisma.favorite.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
    })
  }

  async remove(userId: string, id: string) {
    await this.getOwnedFavorite(userId, id)

    return this.prisma.favorite.delete({
      where: { id },
    })
  }

  async updateOrder(userId: string, id: string, order: number) {
    const favorite = await this.getOwnedFavorite(userId, id)

    if (order < 1 || order > 3) {
      throw new BadRequestException('El orden debe ser entre 1 y 3')
    }

    if (order === favorite.order) return favorite

    const target = await this.prisma.favorite.findFirst({
      where: { categoryId: favorite.categoryId, order },
    })

    return this.prisma.$transaction(async (tx) => {
      if (target) {
        await tx.favorite.update({
          where: { id: target.id },
          data: { order: favorite.order + 1000 },
        })
      }

      const moved = await tx.favorite.update({
        where: { id },
        data: { order },
      })

      if (target) {
        await tx.favorite.update({
          where: { id: target.id },
          data: { order: favorite.order },
        })
      }

      return moved
    })
  }

  async reorder(userId: string, categoryId: string, items: { id: string; order: number }[]) {
    await this.assertCategoryOwner(userId, categoryId)

    const owned = await this.prisma.favorite.findMany({
      where: { categoryId },
      select: { id: true },
    })
    const ownedIds = new Set(owned.map((f) => f.id))
    if (!items.every((i) => ownedIds.has(i.id))) {
      throw new BadRequestException('Favorite fuera de la categoria')
    }

    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.favorite.update({
          where: { id: item.id },
          data: { order: item.order + 1000 },
        })
      }

      for (const item of items) {
        await tx.favorite.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      }
    })
  }
}
