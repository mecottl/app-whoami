import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { TestController } from './test/test.controller.js';
import { CardsModule } from './cards/cards.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { ExternalModule } from './external/external.module.js';
import { CategoriesModule } from './categories/categories.module.js';

@Module({
  imports: [AuthModule, CardsModule, FavoritesModule, ExternalModule, CategoriesModule],
  controllers: [TestController]
})
export class AppModule {}
