import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { FavoritesService } from './favorites.service.js'

function makePrisma() {
  return {
    cardCategory: { findUnique: vi.fn() },
    favorite: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  } as any
}

const OWNED = { id: 'cat1', card: { userId: 'yo' } }

describe('FavoritesService.create', () => {
  let prisma: any
  let service: FavoritesService

  beforeEach(() => {
    prisma = makePrisma()
    service = new FavoritesService(prisma)
    prisma.cardCategory.findUnique.mockResolvedValue(OWNED)
  })

  it('403 si la categoría es de otro usuario', async () => {
    prisma.cardCategory.findUnique.mockResolvedValue({ id: 'cat1', card: { userId: 'otro' } })
    await expect(
      service.create('yo', 'cat1', { title: 't', imageUrl: 'i', externalId: 'e' }),
    ).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('es idempotente: si el externalId ya existe, devuelve el favorito y no crea otro', async () => {
    const existing = { id: 'f1', externalId: 'e', order: 1 }
    prisma.favorite.findMany.mockResolvedValue([existing])

    const res = await service.create('yo', 'cat1', {
      title: 't',
      imageUrl: 'i',
      externalId: 'e',
    })

    expect(res).toBe(existing)
    expect(prisma.favorite.create).not.toHaveBeenCalled()
  })

  it('rechaza el 4º favorito', async () => {
    prisma.favorite.findMany.mockResolvedValue([
      { id: 'a', externalId: '1', order: 1 },
      { id: 'b', externalId: '2', order: 2 },
      { id: 'c', externalId: '3', order: 3 },
    ])

    await expect(
      service.create('yo', 'cat1', { title: 't', imageUrl: 'i', externalId: '4' }),
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('coloca el favorito en el primer slot libre', async () => {
    prisma.favorite.findMany.mockResolvedValue([
      { id: 'a', externalId: '1', order: 1 },
      { id: 'c', externalId: '3', order: 3 },
    ])
    prisma.favorite.create.mockImplementation(({ data }: any) => data)

    const res = await service.create('yo', 'cat1', {
      title: 't',
      imageUrl: 'i',
      externalId: '2',
    })

    expect(res).toMatchObject({ order: 2, categoryId: 'cat1' })
  })
})
