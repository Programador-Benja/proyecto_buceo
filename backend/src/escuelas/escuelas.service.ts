import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearEscuelaDto } from './dto/crear-escuela.dto.js';
import { ActualizarEscuelaDto } from './dto/actualizar-escuela.dto.js';

@Injectable()
export class EscuelasService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodas() {
    return this.prisma.escuela.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async obtenerPorId(id: number) {
    const escuela = await this.prisma.escuela.findUnique({
      where: { id },
    });

    if (!escuela) {
      throw new NotFoundException(
        `No se encontró la escuela con ID ${id}`,
      );
    }

    return escuela;
  }

  async crear(datos: CrearEscuelaDto) {
    return this.prisma.escuela.create({
      data: datos,
    });
  }

  async actualizar(id: number, datos: ActualizarEscuelaDto) {
    await this.obtenerPorId(id);

    return this.prisma.escuela.update({
      where: { id },
      data: datos,
    });
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);

    return this.prisma.escuela.delete({
      where: { id },
    });
  }
}
