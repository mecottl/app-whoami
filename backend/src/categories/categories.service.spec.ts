import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { CategoriesService } from './categories.service.js'

function makePrisma(overrides: Record<string, any> = {}) {
  return {
    card: { findUnique: vi.fn() },
    cardCategory: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    ...overrides,
  } as any
}

describe('CategoriesService', () => {
  let prisma: any
  let service: CategoriesService

  beforeEach(() => {
    prisma = makePrisma()
    service = new CategoriesService(prisma)
  })

  it('rechaza crear categoría en una card ajena (403)', async () => {
    prisma.card.findUnique.mockResolvedValue({ id: 'c1', userId: 'otro' })

    await expect(
      service.create('yo', 'c1', { name: 'Películas', type: 'MOVIE' as any }),
    ).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('404 si la card no existe', async () => {
    prisma.card.findUnique.mockResolvedValue(null)

    await expect(
      service.create('yo', 'x', { name: 'Películas', type: 'MOVIE' as any }),
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it('409 si ya hay una categoría de ese tipo', async () => {
    prisma.card.findUnique.mockResolvedValue({ id: 'c1', userId: 'yo' })
    prisma.cardCategory.findFirst.mockResolvedValueOnce({ id: 'dup' })

    await expect(
      service.create('yo', 'c1', { name: 'Películas', type: 'MOVIE' as any }),
    ).rejects.toBeInstanceOf(ConflictException)
  })

  it('crea la categoría con el siguiente order', async () => {
    prisma.card.findUnique.mockResolvedValue({ id: 'c1', userId: 'yo' })
    prisma.cardCategory.findFirst
      .mockResolvedValueOnce(null) // dup check
      .mockResolvedValueOnce({ order: 2 }) // last
    prisma.cardCategory.create.mockImplementation(({ data }: any) => data)

    const res = await service.create('yo', 'c1', {
      name: 'Series',
      type: 'SERIES' as any,
    })

    expect(res).toMatchObject({ cardId: 'c1', order: 3, type: 'SERIES' })
  })
})
