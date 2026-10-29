import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InstructoresService,
  Instructor,
  CrearInstructor,
} from '../../servicios/instructores';
import {
  EscuelasService,
  Escuela,
} from '../../servicios/escuelas';

@Component({
  selector: 'app-instructores',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './instructores.html',
  styleUrl: './instructores.scss',
})
export class Instructores implements OnInit {
  private readonly instructoresService = inject(InstructoresService);
  private readonly escuelasService = inject(EscuelasService);

  instructores: Instructor[] = [];
  escuelas: Escuela[] = [];

  formulario: CrearInstructor = {
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    especialidad: '',
    activo: true,
    escuelaId: 0,
  };

  instructorEditandoId: number | null = null;
  cargando = false;
  guardando = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  ngOnInit(): void {
    this.cargarEscuelas();
    this.cargarInstructores();
  }

  cargarEscuelas(): void {
    this.escuelasService.obtenerTodas().subscribe({
      next: (escuelas) => {
        this.escuelas = escuelas;

        if (this.escuelas.length > 0 && this.formulario.escuelaId === 0) {
          this.formulario.escuelaId = this.escuelas[0].id;
        }
      },
      error: (error) => {
        console.error('Error al cargar escuelas:', error);
        this.mostrarMensaje('No se pudieron cargar las escuelas.', 'error');
      },
    });
  }

  cargarInstructores(): void {
    this.cargando = true;

    this.instructoresService.obtenerTodos().subscribe({
      next: (instructores) => {
        this.instructores = instructores;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar instructores:', error);
        this.cargando = false;
        this.mostrarMensaje('No se pudieron cargar los instructores.', 'error');
      },
    });
  }

  guardarInstructor(): void {
    const nombre = this.formulario.nombre.trim();
    const apellido = this.formulario.apellido.trim();
    const dni = this.formulario.dni.trim();

    if (nombre.length < 2 || apellido.length < 2 || dni.length < 7) {
      this.mostrarMensaje(
        'Completá el nombre, apellido y DNI correctamente.',
        'error',
      );
      return;
    }

    if (!this.formulario.escuelaId) {
      this.mostrarMensaje('Seleccioná una escuela.', 'error');
      return;
    }

    const datos: CrearInstructor = {
      nombre,
      apellido,
      dni,
      escuelaId: Number(this.formulario.escuelaId),
      activo: this.formulario.activo,
    };

    const email = this.formulario.email?.trim();
    const telefono = this.formulario.telefono?.trim();
    const especialidad = this.formulario.especialidad?.trim();

    if (email) datos.email = email;
    if (telefono) datos.telefono = telefono;
    if (especialidad) datos.especialidad = especialidad;

    this.guardando = true;

    const estabaEditando = this.instructorEditandoId !== null;

    const operacion = estabaEditando
      ? this.instructoresService.actualizar(this.instructorEditandoId!, datos)
      : this.instructoresService.crear(datos);

    operacion.subscribe({
      next: () => {
        this.mostrarMensaje(
          estabaEditando
            ? 'Instructor actualizado correctamente.'
            : 'Instructor registrado correctamente.',
          'exito',
        );

        this.limpiarFormulario();
        this.cargarInstructores();
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error al guardar el instructor:', error);
        this.guardando = false;

        if (error.status === 409) {
          this.mostrarMensaje('Ese DNI ya está registrado.', 'error');
        } else if (error.status === 400) {
          this.mostrarMensaje('Revisá los datos ingresados.', 'error');
        } else if (error.status === 404) {
          this.mostrarMensaje('La escuela seleccionada no existe.', 'error');
        } else {
          this.mostrarMensaje('No se pudo guardar el instructor.', 'error');
        }
      },
    });
  }

  editarInstructor(instructor: Instructor): void {
    this.instructorEditandoId = instructor.id;

    this.formulario = {
      nombre: instructor.nombre,
      apellido: instructor.apellido,
      dni: instructor.dni,
      email: instructor.email ?? '',
      telefono: instructor.telefono ?? '',
      especialidad: instructor.especialidad ?? '',
      activo: instructor.activo,
      escuelaId: instructor.escuelaId,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  eliminarInstructor(instructor: Instructor): void {
    const confirmar = window.confirm(
      `¿Querés eliminar a ${instructor.nombre} ${instructor.apellido}?`,
    );

    if (!confirmar) return;

    this.instructoresService.eliminar(instructor.id).subscribe({
      next: () => {
        this.mostrarMensaje('Instructor eliminado correctamente.', 'exito');

        if (this.instructorEditandoId === instructor.id) {
          this.limpiarFormulario();
        }

        this.cargarInstructores();
      },
      error: (error) => {
        console.error('Error al eliminar el instructor:', error);
        this.mostrarMensaje('No se pudo eliminar el instructor.', 'error');
      },
    });
  }
  
  contarActivos(): number {
    return this.instructores.filter((instructor) => instructor.activo).length;
  }

  limpiarFormulario(): void {
    this.instructorEditandoId = null;

    this.formulario = {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      especialidad: '',
      activo: true,
      escuelaId: this.escuelas[0]?.id ?? 0,
    };
  }

  private mostrarMensaje(
    texto: string,
    tipo: 'exito' | 'error',
  ): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
  }

  cerrarMensaje(): void {
    this.mensaje = '';
  }
}
