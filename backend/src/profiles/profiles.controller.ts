import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Req } from "@nestjs/common";
import { ProfilesService } from "./profiles.service.js";
import { CreateProfileDto } from "./dto/create-profile.dto.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@UseGuards(JwtAuthGuard)
@Controller("profiles")
export class ProfilesController {
    constructor (private readonly profilesService: ProfilesService){}

    @Post()
    create(@Req() req: any, @Body() dto: CreateProfileDto) {
        return this.profilesService.create(req.user.userId, dto)
    }

    @Get()
    findAll(@Req() req: any) {
        return this.profilesService.findAll(req.user.userId)
    }

    @Get(":id")
    findOne(@Req() req: any, @Param("id") id: string) {
        return this.profilesService.findOne(req.user.userId, id)
    }

    @Patch(":id")
    update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateProfileDto) {
        return this.profilesService.update(req.user.userId, id, dto)
    }

    @Delete(":id")
    remove(@Req() req: any, @Param("id") id: string) {
        return this.profilesService.remove(req.user.userId, id)
    }

}