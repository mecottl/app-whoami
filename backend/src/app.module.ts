import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { TestController } from './test/test.controller.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';

@Module({
  imports: [AuthModule, ProfilesModule, FavoritesModule],
  controllers: [TestController]
})
export class AppModule {}
