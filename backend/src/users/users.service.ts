import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

interface CreateUserData {
    email: string;
    name: string;
    passwordHash: string;
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
                passwordHash: data.passwordHash,
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
