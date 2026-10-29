import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EscuelasService,
  Escuela,
  CrearEscuela,
} from '../../servicios/escuelas';

@Component({
  selector: 'app-escuelas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './escuelas.html',
  styleUrl: './escuelas.scss',
})
export class Escuelas implements OnInit {
  private readonly escuelasService = inject(EscuelasService);

  escuelas: Escuela[] = [];

  formulario: CrearEscuela = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    activa: true,
  };

  escuelaEditandoId: number | null = null;
  cargando = false;
  guardando = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  ngOnInit(): void {
    this.cargarEscuelas();
  }

  cargarEscuelas(): void {
    this.cargando = true;

    this.escuelasService.obtenerTodas().subscribe({
      next: (escuelas) => {
        this.escuelas = escuelas;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar escuelas:', error);
        this.cargando = false;
        this.mostrarMensaje(
          'No se pudieron cargar las escuelas. Verificá que el backend esté funcionando.',
          'error',
        );
      },
    });
  }

  guardarEscuela(): void {
    const nombre = this.formulario.nombre.trim();

    if (nombre.length < 2) {
      this.mostrarMensaje(
        'El nombre debe tener al menos 2 caracteres.',
        'error',
      );
      return;
    }

    const datos: CrearEscuela = {
      nombre,
      activa: this.formulario.activa,
    };

    const email = this.formulario.email?.trim();
    const telefono = this.formulario.telefono?.trim();
    const direccion = this.formulario.direccion?.trim();

    if (email) datos.email = email;
    if (telefono) datos.telefono = telefono;
    if (direccion) datos.direccion = direccion;

    this.guardando = true;

    const estabaEditando = this.escuelaEditandoId !== null;

    const operacion = estabaEditando
      ? this.escuelasService.actualizar(this.escuelaEditandoId!, datos)
      : this.escuelasService.crear(datos);

    operacion.subscribe({
      next: () => {
        this.mostrarMensaje(
          estabaEditando
            ? 'Escuela actualizada correctamente.'
            : 'Escuela registrada correctamente.',
          'exito',
        );

        this.limpiarFormulario();
        this.cargarEscuelas();
        this.guardando = false;
      },
      error: (error) => {
        console.error('Error al guardar la escuela:', error);
        this.guardando = false;

        if (error.status === 409) {
          this.mostrarMensaje(
            'Ese correo ya está registrado en otra escuela.',
            'error',
          );
        } else if (error.status === 400) {
          this.mostrarMensaje(
            'Los datos enviados no son válidos. Revisá el formulario.',
            'error',
          );
        } else {
          this.mostrarMensaje(
            'No se pudo guardar la escuela. Verificá la conexión con el servidor.',
            'error',
          );
        }
      },
    });
  }

  editarEscuela(escuela: Escuela): void {
    this.escuelaEditandoId = escuela.id;

    this.formulario = {
      nombre: escuela.nombre,
      email: escuela.email ?? '',
      telefono: escuela.telefono ?? '',
      direccion: escuela.direccion ?? '',
      activa: escuela.activa,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  eliminarEscuela(escuela: Escuela): void {
    const confirmar = window.confirm(
      `¿Querés eliminar la escuela "${escuela.nombre}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmar) return;

    this.escuelasService.eliminar(escuela.id).subscribe({
      next: () => {
        this.mostrarMensaje('Escuela eliminada correctamente.', 'exito');
        this.cargarEscuelas();

        if (this.escuelaEditandoId === escuela.id) {
          this.limpiarFormulario();
        }
      },
      error: (error) => {
        console.error('Error al eliminar la escuela:', error);
        this.mostrarMensaje('No se pudo eliminar la escuela.', 'error');
      },
    });
  }

  limpiarFormulario(): void {
    this.escuelaEditandoId = null;

    this.formulario = {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      activa: true,
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
