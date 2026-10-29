import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CrearCursoDto } from './dto/crear-curso.dto.js';
import { ActualizarCursoDto } from './dto/actualizar-curso.dto.js';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class CursosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos() {
    return this.prisma.curso.findMany({
      include: {
        escuela: true,
        instructor: true,
      },
      orderBy: {
        fechaInicio: 'desc',
      },
    });
  }

  async obtenerPorId(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        escuela: true,
        instructor: true,
      },
    });

    if (!curso) {
      throw new NotFoundException('El curso solicitado no existe.');
    }

    return curso;
  }

  async crear(datos: CrearCursoDto) {
    await this.validarRelaciones(datos.escuelaId, datos.instructorId);

    this.validarFechas(datos.fechaInicio, datos.fechaFin);

    try {
      return await this.prisma.curso.create({
        data: {
          nombre: datos.nombre.trim(),
          descripcion: datos.descripcion?.trim() || null,
          nivel: datos.nivel,
          fechaInicio: new Date(datos.fechaInicio),
          fechaFin: datos.fechaFin ? new Date(datos.fechaFin) : null,
          cupoMaximo: datos.cupoMaximo,
          precio: datos.precio ?? 0,
          estado: datos.estado ?? 'PROGRAMADO',
          escuelaId: datos.escuelaId,
          instructorId: datos.instructorId,
        },
        include: {
          escuela: true,
          instructor: true,
        },
      });
    } catch (error) {
      this.manejarErrorPrisma(error);
    }
  }

  async actualizar(id: number, datos: ActualizarCursoDto) {
    await this.obtenerPorId(id);

    if (datos.escuelaId !== undefined || datos.instructorId !== undefined) {
      const cursoActual = await this.prisma.curso.findUniqueOrThrow({
        where: { id },
        select: {
          escuelaId: true,
          instructorId: true,
        },
      });

      await this.validarRelaciones(
        datos.escuelaId ?? cursoActual.escuelaId,
        datos.instructorId ?? cursoActual.instructorId,
      );
    }

    if (datos.fechaInicio !== undefined || datos.fechaFin !== undefined) {
      const cursoActual = await this.prisma.curso.findUniqueOrThrow({
        where: { id },
        select: {
          fechaInicio: true,
          fechaFin: true,
        },
      });

      this.validarFechas(
        datos.fechaInicio ?? cursoActual.fechaInicio.toISOString().slice(0, 10),
        datos.fechaFin === undefined
          ? cursoActual.fechaFin?.toISOString().slice(0, 10)
          : datos.fechaFin,
      );
    }

    try {
      return await this.prisma.curso.update({
        where: { id },
        data: {
          ...(datos.nombre !== undefined && { nombre: datos.nombre.trim() }),
          ...(datos.descripcion !== undefined && {
            descripcion: datos.descripcion.trim() || null,
          }),
          ...(datos.nivel !== undefined && { nivel: datos.nivel }),
          ...(datos.fechaInicio !== undefined && {
            fechaInicio: new Date(datos.fechaInicio),
          }),
          ...(datos.fechaFin !== undefined && {
            fechaFin: datos.fechaFin ? new Date(datos.fechaFin) : null,
          }),
          ...(datos.cupoMaximo !== undefined && {
            cupoMaximo: datos.cupoMaximo,
          }),
          ...(datos.precio !== undefined && { precio: datos.precio }),
          ...(datos.estado !== undefined && { estado: datos.estado }),
          ...(datos.escuelaId !== undefined && {
            escuelaId: datos.escuelaId,
          }),
          ...(datos.instructorId !== undefined && {
            instructorId: datos.instructorId,
          }),
        },
        include: {
          escuela: true,
          instructor: true,
        },
      });
    } catch (error) {
      this.manejarErrorPrisma(error);
    }
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);

    try {
      return await this.prisma.curso.delete({
        where: { id },
      });
    } catch (error) {
      this.manejarErrorPrisma(error);
    }
  }

  private async validarRelaciones(
    escuelaId: number,
    instructorId: number,
  ) {
    const escuela = await this.prisma.escuela.findUnique({
      where: { id: escuelaId },
      select: { id: true, activa: true },
    });

    if (!escuela) {
      throw new BadRequestException('La escuela indicada no existe.');
    }

    if (!escuela.activa) {
      throw new BadRequestException('La escuela seleccionada está inactiva.');
    }

    const instructor = await this.prisma.instructor.findUnique({
      where: { id: instructorId },
      select: { id: true, activo: true, escuelaId: true },
    });

    if (!instructor) {
      throw new BadRequestException('El instructor indicado no existe.');
    }

    if (!instructor.activo) {
      throw new BadRequestException('El instructor seleccionado está inactivo.');
    }

    if (instructor.escuelaId !== escuelaId) {
      throw new BadRequestException(
        'El instructor debe pertenecer a la escuela seleccionada.',
      );
    }
  }

  private validarFechas(fechaInicio: string, fechaFin?: string | null) {
    if (fechaFin && fechaFin < fechaInicio) {
      throw new BadRequestException(
        'La fecha de finalización no puede ser anterior a la fecha de inicio.',
      );
    }
  }
  private manejarErrorPrisma(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003':
          throw new ConflictException(
            'No se puede realizar la operación porque existen relaciones asociadas.',
          );

        case 'P2025':
          throw new NotFoundException('El curso solicitado no existe.');
      }
    }

    throw error;
  }
}
