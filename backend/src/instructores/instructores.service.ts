import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CrearInstructorDto } from './dto/crear-instructor.dto.js';
import { ActualizarInstructorDto } from './dto/actualizar-instructor.dto.js';

@Injectable()
export class InstructoresService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos() {
    return this.prisma.instructor.findMany({
      include: {
        escuela: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' },
      ],
    });
  }

  async obtenerPorId(id: number) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { id },
      include: {
        escuela: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException(
        `No se encontró el instructor con ID ${id}.`,
      );
    }

    return instructor;
  }

  async crear(datos: CrearInstructorDto) {
    const escuela = await this.prisma.escuela.findUnique({
      where: { id: datos.escuelaId },
    });

    if (!escuela) {
      throw new NotFoundException(
        `No existe la escuela con ID ${datos.escuelaId}.`,
      );
    }

    const existente = await this.prisma.instructor.findUnique({
      where: { dni: datos.dni },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe un instructor registrado con ese DNI.',
      );
    }

    return this.prisma.instructor.create({
      data: datos,
      include: {
        escuela: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  async actualizar(id: number, datos: ActualizarInstructorDto) {
    await this.obtenerPorId(id);

    if (datos.escuelaId !== undefined) {
      const escuela = await this.prisma.escuela.findUnique({
        where: { id: datos.escuelaId },
      });

      if (!escuela) {
        throw new NotFoundException(
          `No existe la escuela con ID ${datos.escuelaId}.`,
        );
      }
    }

    if (datos.dni !== undefined) {
      const existente = await this.prisma.instructor.findUnique({
        where: { dni: datos.dni },
      });

      if (existente && existente.id !== id) {
        throw new ConflictException(
          'Ya existe otro instructor registrado con ese DNI.',
        );
      }
    }

    return this.prisma.instructor.update({
      where: { id },
      data: datos,
      include: {
        escuela: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);

    return this.prisma.instructor.delete({
      where: { id },
    });
  }
}
