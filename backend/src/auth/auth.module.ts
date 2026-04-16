import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { UsersModule } from "../users/users.module.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30d' }
        })
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}