import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearCursoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descripcion?: string;

  @IsString()
  @IsIn([
    'PRINCIPIANTE',
    'INTERMEDIO',
    'AVANZADO',
    'ESPECIALIZACION',
  ])
  nivel!: string;

  @IsDateString()
  fechaInicio!: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cupoMaximo!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsString()
  @IsIn(['PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'])
  estado?: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  escuelaId!: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  instructorId!: number;
}
