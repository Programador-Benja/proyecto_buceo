import { Module } from '@nestjs/common';
import { CursosController } from './cursos.controller.js';
import { CursosService } from './cursos.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
