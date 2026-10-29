import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EscuelasController } from './escuelas.controller.js';
import { EscuelasService } from './escuelas.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [EscuelasController],
  providers: [EscuelasService],
})
export class EscuelasModule {}
