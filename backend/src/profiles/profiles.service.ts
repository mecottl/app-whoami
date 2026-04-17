import { Injectable } from "@nestjs/common";
import { prisma } from "../../lib/prisma.js"
import { CreateProfileDto } from "./dto/create-profile.dto.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { Template, Layout } from "../../generated/prisma/enums.js";
import { NotFoundException } from '@nestjs/common'

@Injectable()
export class ProfilesService {
    create(userId: string, dto: CreateProfileDto) {
        return prisma.profile.create({
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
        return prisma.profile.findMany({
            where: { userId }
        })
    }

    async findOne(userId: string, id: string) {
        const profile = await prisma.profile.findFirst({
            where: { userId, id}
        })
        if (!profile) {
            throw new NotFoundException('Profile not found')
        }
        return profile
    }

    async update(userId: string, id: string, dto: UpdateProfileDto) {
        return await prisma.profile.update({
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
        return await prisma.profile.delete({
            where: { id, userId}
        })
    }
}