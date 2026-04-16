import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service.js";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async register (data: {email:string; name: string; password: string;}) {
        const hashed = await bcrypt.hash(data.password, 10);

        const user = await this.usersService.create({
            ...data,
            password: hashed
        });
        return this.generateToken(user.id, user.email);
    }

    async login (email:string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if(!user) throw new UnauthorizedException("Credenciales inválidas");

        const valid = await bcrypt.compare(password, user.password);

        if(!valid) throw new UnauthorizedException("Credenciales inválidas");

        return this.generateToken(user.id, user.email);
    }

    private generateToken(userId: string, email: string) {
        return {
            access_token: this.jwtService.sign({ 
                sub: userId, 
                email
            })
        };
    }
}
