import { Module } from '@nestjs/common';
import { AlumnosController } from './alumnos.controller.js';
import { AlumnosService } from './alumnos.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AlumnosController],
  providers: [AlumnosService],
  exports: [AlumnosService],
})
export class AlumnosModule {}
