import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Alumno,
  AlumnosService,
  CrearAlumno,
} from '../../servicios/alumnos';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.scss',
})
export class Alumnos implements OnInit {
  private readonly alumnosService = inject(AlumnosService);

  alumnos: Alumno[] = [];

  cargando = false;
  guardando = false;
  error = '';
  mensaje = '';

  mostrarFormulario = false;
  modoEdicion = false;
  alumnoId: number | null = null;

  formulario: CrearAlumno = this.formularioVacio();

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  private formularioVacio(): CrearAlumno {
    return {
      nombre: '',
      apellido: '',
      dni: '',
      fechaNacimiento: null,
      email: null,
      telefono: null,
      direccion: null,
      contactoEmergencia: null,
      telefonoEmergencia: null,
      activo: true,
    };
  }

  cargarAlumnos(): void {
    this.cargando = true;
    this.error = '';

    this.alumnosService.obtenerTodos().subscribe({
      next: (alumnos) => {
        this.alumnos = alumnos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar alumnos:', err);
        this.error = 'No se pudieron cargar los alumnos.';
        this.cargando = false;
      },
    });
  }

  nuevoAlumno(): void {
    this.formulario = this.formularioVacio();
    this.alumnoId = null;
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  editarAlumno(alumno: Alumno): void {
    this.alumnoId = alumno.id;
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';

    this.formulario = {
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      dni: alumno.dni,
      fechaNacimiento: alumno.fechaNacimiento
        ? alumno.fechaNacimiento.substring(0, 10)
        : null,
      email: alumno.email,
      telefono: alumno.telefono,
      direccion: alumno.direccion,
      contactoEmergencia: alumno.contactoEmergencia,
      telefonoEmergencia: alumno.telefonoEmergencia,
      activo: alumno.activo,
    };
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.formulario = this.formularioVacio();
    this.alumnoId = null;
    this.error = '';
  }

  guardarAlumno(): void {
    this.error = '';
    this.mensaje = '';

    const datos: Partial<CrearAlumno> = {
      nombre: this.formulario.nombre.trim(),
      apellido: this.formulario.apellido.trim(),
      dni: this.formulario.dni.trim(),
      fechaNacimiento: this.formulario.fechaNacimiento || null,
      email: this.formulario.email?.trim() || null,
      telefono: this.formulario.telefono?.trim() || null,
      direccion: this.formulario.direccion?.trim() || null,
      contactoEmergencia:
        this.formulario.contactoEmergencia?.trim() || null,
      telefonoEmergencia:
        this.formulario.telefonoEmergencia?.trim() || null,
      activo: this.formulario.activo,
    };

    this.guardando = true;

    const peticion = this.modoEdicion && this.alumnoId !== null
      ? this.alumnosService.actualizar(this.alumnoId, datos)
      : this.alumnosService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.mensaje = this.modoEdicion
          ? 'Alumno actualizado correctamente.'
          : 'Alumno registrado correctamente.';

        this.cargarAlumnos();
      },
      error: (err) => {
        console.error('Error al guardar alumno:', err);

        this.guardando = false;

        if (err.status === 409) {
          this.error = 'Ya existe un alumno registrado con ese DNI.';
        } else if (err.status === 400) {
          this.error = 'Revisá los datos ingresados.';
        } else {
          this.error = 'No se pudo guardar el alumno.';
        }
      },
    });
  }

  eliminarAlumno(alumno: Alumno): void {
    const confirmado = window.confirm(
      `¿Estás seguro de eliminar a ${alumno.nombre} ${alumno.apellido}?`,
    );

    if (!confirmado) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.alumnosService.eliminar(alumno.id).subscribe({
      next: () => {
        this.mensaje = 'Alumno eliminado correctamente.';
        this.cargarAlumnos();
      },
      error: (err) => {
        console.error('Error al eliminar alumno:', err);
        this.error = 'No se pudo eliminar el alumno.';
      },
    });
  }
}
