import { Injectable } from "@nestjs/common";
import { prisma } from "../../lib/prisma.js";

@Injectable()
export class UsersService {
    create(data: { email:string; name: string; password: string }) {
        return prisma.user.create({ data });
    }

    findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    findById(id : string) {
        return prisma.user.findUnique({ where: { id } });
    }
}