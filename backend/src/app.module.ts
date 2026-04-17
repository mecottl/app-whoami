import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { TestController } from './test/test.controller.js';
import { ProfilesModule } from './profiles/profiles.module.js';

@Module({
  imports: [AuthModule, ProfilesModule],
  controllers: [TestController]
})
export class AppModule {}
