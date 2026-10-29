import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Escuela {
  id: number;
  nombre: string;
  activa: boolean;
}

export interface Instructor {
  id: number;
  nombre: string;
  apellido: string;
  activo: boolean;
  escuelaId: number;
}

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string | null;
  nivel: string;
  fechaInicio: string;
  fechaFin: string | null;
  cupoMaximo: number;
  precio: number | string;
  estado: string;
  escuelaId: number;
  instructorId: number;
  escuela: Escuela;
  instructor: Instructor;
  createdAt: string;
  updatedAt: string;
}

export interface CrearCurso {
  nombre: string;
  descripcion?: string | null;
  nivel: string;
  fechaInicio: string;
  fechaFin?: string | null;
  cupoMaximo: number;
  precio?: number;
  estado?: string;
  escuelaId: number;
  instructorId: number;
}

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/cursos';
  private readonly escuelasUrl = 'http://localhost:3000/escuelas';
  private readonly instructoresUrl = 'http://localhost:3000/instructores';

  obtenerTodos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/${id}`);
  }

  crear(datos: CrearCurso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: Partial<CrearCurso>): Observable<Curso> {
    return this.http.patch<Curso>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<Curso> {
    return this.http.delete<Curso>(`${this.apiUrl}/${id}`);
  }

  obtenerEscuelas(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(this.escuelasUrl);
  }

  obtenerInstructores(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.instructoresUrl);
  }
}
