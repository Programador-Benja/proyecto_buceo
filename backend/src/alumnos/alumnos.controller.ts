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

import { AlumnosService } from './alumnos.service.js';
import { CrearAlumnoDto } from './dto/crear-alumno.dto.js';
import { ActualizarAlumnoDto } from './dto/actualizar-alumno.dto.js';

@Controller('alumnos')
export class AlumnosController {
  constructor(
    private readonly alumnosService: AlumnosService,
  ) {}

  @Get()
  obtenerTodos() {
    return this.alumnosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.alumnosService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() datos: CrearAlumnoDto) {
    return this.alumnosService.crear(datos);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarAlumnoDto,
  ) {
    return this.alumnosService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.alumnosService.eliminar(id);
  }
}
