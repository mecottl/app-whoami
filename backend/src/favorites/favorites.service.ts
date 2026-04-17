import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma.js'

@Injectable()
export class FavoritesService {

    async create(profileId: string, data: any) {
        const { title, imageUrl, externalId, type, order } = data

        const count = await prisma.favorite.count({
            where: {
                profileId,
                type,
            }
        })

        if (count >= 3) throw new BadRequestException('Solo puedes tener 3 favoritos por tipo')


        if (order < 1 || order > 3) {
            throw new BadRequestException('El orden debe ser entre 1 y 3')
        }

        const exists = await prisma.favorite.findFirst({
            where: {
                profileId,
                type,
                order,
            }
        })

        if (exists) throw new BadRequestException('Ya tienes un favorito en ese orden para este tipo')

        return prisma.favorite.create({
            data: {
                title,
                imageUrl,
                externalId,
                type,
                order,
                profileId,
            }
        })
    }

    async findByProfile(profileId: string) {
        return prisma.favorite.findMany({
            where: {
                profileId,
            },
            orderBy: [
                { type: 'asc' },
                { order: 'asc' },
            ]
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

        const exists = await prisma.favorite.findFirst({
            where: {
                profileId: favorite.profileId,
                type: favorite.type,
                order
            }
        })

        if (exists && exists.id !== id) {
            throw new BadRequestException('Position already taken')
        }

        return prisma.favorite.update({
            where: { id },
            data: { order }
        })
    }
}
