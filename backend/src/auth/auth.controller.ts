import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

interface SolicitudAutenticada extends Request {
  user: {
    sub: number;
    email: string;
    rol: 'ADMIN' | 'ALUMNO';
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() datos: LoginDto) {
    return this.authService.login(datos.email, datos.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  perfil(@Req() solicitud: SolicitudAutenticada) {
    const usuarioId = solicitud.user.sub;

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      throw new UnauthorizedException('Token inválido.');
    }

    return this.authService.obtenerPerfil(usuarioId);
  }
}
