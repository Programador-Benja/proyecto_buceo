import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CrearAlumnoDto } from './dto/crear-alumno.dto.js';
import { ActualizarAlumnoDto } from './dto/actualizar-alumno.dto.js';

@Injectable()
export class AlumnosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos() {
    return this.prisma.alumno.findMany({
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' },
      ],
    });
  }

  async obtenerPorId(id: number) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
    });

    if (!alumno) {
      throw new NotFoundException(
        `No se encontró el alumno con ID ${id}.`,
      );
    }

    return alumno;
  }

  async crear(datos: CrearAlumnoDto) {
    const existente = await this.prisma.alumno.findUnique({
      where: { dni: datos.dni },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe un alumno registrado con ese DNI.',
      );
    }

    const { fechaNacimiento, ...resto } = datos;

    return this.prisma.alumno.create({
      data: {
        ...resto,
        ...(fechaNacimiento !== undefined && {
          fechaNacimiento: fechaNacimiento
            ? new Date(fechaNacimiento)
            : null,
        }),
      },
    });
  }

  async actualizar(id: number, datos: ActualizarAlumnoDto) {
    await this.obtenerPorId(id);

    if (datos.dni !== undefined) {
      const existente = await this.prisma.alumno.findUnique({
        where: { dni: datos.dni },
      });

      if (existente && existente.id !== id) {
        throw new ConflictException(
          'Ya existe otro alumno registrado con ese DNI.',
        );
      }
    }

    const { fechaNacimiento, ...resto } = datos;

    return this.prisma.alumno.update({
      where: { id },
      data: {
        ...resto,
        ...(fechaNacimiento !== undefined && {
          fechaNacimiento: fechaNacimiento
            ? new Date(fechaNacimiento)
            : null,
        }),
      },
    });
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);

    return this.prisma.alumno.delete({
      where: { id },
    });
  }
}
