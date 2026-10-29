import { PartialType } from '@nestjs/mapped-types';
import { CrearCursoDto } from './crear-curso.dto.js';

export class ActualizarCursoDto extends PartialType(CrearCursoDto) {}
