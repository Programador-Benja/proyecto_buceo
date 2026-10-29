import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { InstructoresController } from './instructores.controller.js';
import { InstructoresService } from './instructores.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [InstructoresController],
  providers: [InstructoresService],
})
export class InstructoresModule {}
