import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { ProfilesController } from './profiles.controller.js';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService]
})
export class ProfilesModule {}