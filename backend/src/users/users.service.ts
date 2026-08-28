import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

interface CreateUserData {
    email: string;
    name: string;
    password: string;
    birthDate?: string | null;
}

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    create(data: CreateUserData) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
            },
        });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}
