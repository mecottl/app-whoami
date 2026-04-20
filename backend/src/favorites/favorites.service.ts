// src/.../favorites.service.ts

import { BadRequestException, Injectable } from '@nestjs/common'
import { prisma } from '../../lib/prisma.js'

@Injectable()
export class FavoritesService {

  async create(categoryId: string, data: any) {
  const { title, imageUrl, externalId, order } = data

  if (order < 1 || order > 3) {
    throw new BadRequestException('El orden debe ser entre 1 y 3')
  }

  const existing = await prisma.favorite.findFirst({
    where: { categoryId, externalId }
  })

  const target = await prisma.favorite.findFirst({
    where: { categoryId, order }
  })

  // 🔁 mover item existente
  if (existing) {
    return prisma.favorite.update({
      where: { id: existing.id },
      data: { order }
    })
  }

  // 🔁 reemplazar contenido del slot (SIN delete)
  if (target) {
    return prisma.favorite.update({
      where: { id: target.id },
      data: {
        title,
        imageUrl,
        externalId
      }
    })
  }

  // 🆕 crear nuevo
  return prisma.favorite.create({
    data: {
      title,
      imageUrl,
      externalId,
      order,
      categoryId
    }
  })
}


  async findByCategory(categoryId: string) {
    return prisma.favorite.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' }
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
    return prisma.favorite.delete({
      where: { id }
    })
  }

  async updateOrder(id: string, order: number) {
    const favorite = await prisma.favorite.findUnique({
      where: { id }
    })

    if (!favorite) {
      throw new BadRequestException('Favorite not found')
    }

    if (order < 1 || order > 3) {
      throw new BadRequestException('El orden debe ser entre 1 y 3')
    }

    const target = await prisma.favorite.findFirst({
      where: {
        categoryId: favorite.categoryId,
        order
      }
    })

    if (target) {
      await prisma.favorite.update({
        where: { id: target.id },
        data: { order: favorite.order }
      })
    }

    return prisma.favorite.update({
      where: { id },
      data: { order }
    })
  }

  async reorder(categoryId: string, items: { id: string; order: number }[]) {
    return prisma.$transaction(async (tx) => {

      for (const item of items) {
        await tx.favorite.update({
          where: { id: item.id },
          data: { order: item.order + 100 }
        })
      }

      for (const item of items) {
        await tx.favorite.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      }

    })
  }
}