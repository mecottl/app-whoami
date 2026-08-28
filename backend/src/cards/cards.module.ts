import { Module } from '@nestjs/common';
import { CardsService } from './cards.service.js';
import { CardsController } from './cards.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
    imports: [UsersModule],
    controllers: [CardsController],
    providers: [CardsService]
})
export class CardsModule {}
