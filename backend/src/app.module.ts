import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { EscuelasModule } from './escuelas/escuelas.module.js';
import { InstructoresModule } from './instructores/instructores.module.js';
import { AlumnosModule } from './alumnos/alumnos.module.js';
import { CursosModule } from './cursos/cursos.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    EscuelasModule,
    InstructoresModule,
    AlumnosModule,
    CursosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
