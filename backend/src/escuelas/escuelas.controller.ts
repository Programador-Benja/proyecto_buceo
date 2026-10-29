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

import { EscuelasService } from './escuelas.service.js';
import { CrearEscuelaDto } from './dto/crear-escuela.dto.js';
import { ActualizarEscuelaDto } from './dto/actualizar-escuela.dto.js';

@Controller('escuelas')
export class EscuelasController {
  constructor(private readonly escuelasService: EscuelasService) {}

  @Get()
  obtenerTodas() {
    return this.escuelasService.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.escuelasService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() datos: CrearEscuelaDto) {
    return this.escuelasService.crear(datos);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarEscuelaDto,
  ) {
    return this.escuelasService.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.escuelasService.eliminar(id);
  }
}
