import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CrearAlumnoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellido!: string;

  @IsString()
  @MinLength(7)
  @MaxLength(20)
  dni!: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  contactoEmergencia?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefonoEmergencia?: string | null;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
