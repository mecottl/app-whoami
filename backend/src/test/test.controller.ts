import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@Controller("test")
export class TestController {
  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Req() req: any) {
    return req.user;
  }
}