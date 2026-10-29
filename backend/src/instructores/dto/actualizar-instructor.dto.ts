import { PartialType } from '@nestjs/mapped-types';
import { CrearInstructorDto } from './crear-instructor.dto.js';

export class ActualizarInstructorDto extends PartialType(CrearInstructorDto) {}
