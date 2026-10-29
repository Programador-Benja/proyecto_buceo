import { PartialType } from '@nestjs/mapped-types';
import { CrearEscuelaDto } from './crear-escuela.dto.js';

export class ActualizarEscuelaDto extends PartialType(CrearEscuelaDto) {}
