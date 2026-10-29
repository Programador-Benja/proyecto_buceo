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

import { CursosService } from './cursos.service.js';
import { CrearCursoDto } from './dto/crear-curso.dto.js';
import { ActualizarCursoDto } from './dto/actualizar-curso.dto.js';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get()
  obtenerTodos() {
    return this.cursosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() datos: CrearCursoDto) {
    return this.cursosService.crear(datos);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarCursoDto,
  ) {
    return this.cursosService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.eliminar(id);
  }
}
