import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { TestController } from './test/test.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [TestController]
})
export class AppModule {}
