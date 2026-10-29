import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { InstructoresService } from './instructores.service.js';
import { CrearInstructorDto } from './dto/crear-instructor.dto.js';
import { ActualizarInstructorDto } from './dto/actualizar-instructor.dto.js';

@Controller('instructores')
export class InstructoresController {
  constructor(
    private readonly instructoresService: InstructoresService,
  ) {}

  @Get()
  obtenerTodos() {
    return this.instructoresService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.instructoresService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() datos: CrearInstructorDto) {
    return this.instructoresService.crear(datos);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarInstructorDto,
  ) {
    return this.instructoresService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.instructoresService.eliminar(id);
  }
}
