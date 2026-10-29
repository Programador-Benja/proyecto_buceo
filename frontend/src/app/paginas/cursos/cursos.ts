import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Curso,
  CrearCurso,
  Escuela,
  Instructor,
  CursosService,
} from '../../servicios/cursos';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss',
})
export class Cursos implements OnInit {
  private readonly cursosService = inject(CursosService);

  cursos: Curso[] = [];
  escuelas: Escuela[] = [];
  instructores: Instructor[] = [];

  cargando = false;
  guardando = false;
  mostrarFormulario = false;
  modoEdicion = false;

  cursoId: number | null = null;
  error = '';
  mensaje = '';

  formulario: CrearCurso = this.formularioVacio();

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  private formularioVacio(): CrearCurso {
    return {
      nombre: '',
      descripcion: '',
      nivel: 'PRINCIPIANTE',
      fechaInicio: '',
      fechaFin: null,
      cupoMaximo: 8,
      precio: 0,
      estado: 'PROGRAMADO',
      escuelaId: 0,
      instructorId: 0,
    };
  }

  cargarDatosIniciales(): void {
    this.cargarCursos();

    this.cursosService.obtenerEscuelas().subscribe({
      next: (datos) => {
        this.escuelas = datos.filter((escuela) => escuela.activa);
      },
      error: () => {
        this.error = 'No se pudieron cargar las escuelas.';
      },
    });

    this.cursosService.obtenerInstructores().subscribe({
      next: (datos) => {
        this.instructores = datos.filter((instructor) => instructor.activo);
      },
      error: () => {
        this.error = 'No se pudieron cargar los instructores.';
      },
    });
  }

  get instructoresDisponibles(): Instructor[] {
    return this.instructores.filter(
      (instructor) => instructor.escuelaId === Number(this.formulario.escuelaId),
    );
  }

  cargarCursos(): void {
    this.cargando = true;
    this.error = '';

    this.cursosService.obtenerTodos().subscribe({
      next: (datos) => {
        this.cursos = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los cursos.';
        this.cargando = false;
      },
    });
  }

  nuevoCurso(): void {
    this.formulario = this.formularioVacio();
    this.cursoId = null;
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }

  editarCurso(curso: Curso): void {
    this.cursoId = curso.id;
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';

    this.formulario = {
      nombre: curso.nombre,
      descripcion: curso.descripcion ?? '',
      nivel: curso.nivel,
      fechaInicio: curso.fechaInicio.substring(0, 10),
      fechaFin: curso.fechaFin?.substring(0, 10) ?? null,
      cupoMaximo: curso.cupoMaximo,
      precio: Number(curso.precio),
      estado: curso.estado,
      escuelaId: curso.escuelaId,
      instructorId: curso.instructorId,
    };
  }

  cambiarEscuela(): void {
    const instructorActual = this.instructores.find(
      (instructor) => instructor.id === Number(this.formulario.instructorId),
    );

    if (
      !instructorActual ||
      instructorActual.escuelaId !== Number(this.formulario.escuelaId)
    ) {
      this.formulario.instructorId = 0;
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.cursoId = null;
    this.error = '';
  }

  guardarCurso(): void {
    this.error = '';
    this.mensaje = '';

    if (
      !this.formulario.nombre.trim() ||
      !this.formulario.fechaInicio ||
      !this.formulario.escuelaId ||
      !this.formulario.instructorId
    ) {
      this.error = 'Completá los campos obligatorios.';
      return;
    }

    if (
      this.formulario.fechaFin &&
      this.formulario.fechaFin < this.formulario.fechaInicio
    ) {
      this.error = 'La fecha de finalización no puede ser anterior al inicio.';
      return;
    }

    const datos: CrearCurso = {
      ...this.formulario,
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion?.trim() || null,
      fechaFin: this.formulario.fechaFin || null,
      cupoMaximo: Number(this.formulario.cupoMaximo),
      precio: Number(this.formulario.precio ?? 0),
      escuelaId: Number(this.formulario.escuelaId),
      instructorId: Number(this.formulario.instructorId),
    };

    this.guardando = true;

    const peticion =
      this.modoEdicion && this.cursoId !== null
        ? this.cursosService.actualizar(this.cursoId, datos)
        : this.cursosService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.mensaje = this.modoEdicion
          ? 'Curso actualizado correctamente.'
          : 'Curso registrado correctamente.';

        this.cargarCursos();
      },
      error: (err) => {
        this.guardando = false;

        if (err.status === 400) {
          this.error =
            err.error?.message instanceof Array
              ? err.error.message.join(' ')
              : err.error?.message || 'Revisá los datos ingresados.';
        } else if (err.status === 404) {
          this.error = 'No se encontró el curso o una entidad relacionada.';
        } else if (err.status === 409) {
          this.error = 'No se pudo completar la operación por un conflicto.';
        } else {
          this.error = 'Ocurrió un error al guardar el curso.';
        }
      },
    });
  }

  eliminarCurso(curso: Curso): void {
    const confirmado = window.confirm(
      `¿Querés eliminar el curso "${curso.nombre}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.cursosService.eliminar(curso.id).subscribe({
      next: () => {
        this.mensaje = 'Curso eliminado correctamente.';
        this.cargarCursos();
      },
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo eliminar el curso.';
      },
    });
  }
}
