import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Instructor {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string | null;
  telefono: string | null;
  especialidad: string | null;
  activo: boolean;
  escuelaId: number;
  createdAt: string;
  updatedAt: string;
  escuela?: {
    id: number;
    nombre: string;
  };
}

export interface CrearInstructor {
  nombre: string;
  apellido: string;
  dni: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  activo?: boolean;
  escuelaId: number;
}

@Injectable({
  providedIn: 'root',
})
export class InstructoresService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/instructores';

  obtenerTodos(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.apiUrl}/${id}`);
  }

  crear(datos: CrearInstructor): Observable<Instructor> {
    return this.http.post<Instructor>(this.apiUrl, datos);
  }

  actualizar(
    id: number,
    datos: Partial<CrearInstructor>,
  ): Observable<Instructor> {
    return this.http.patch<Instructor>(
      `${this.apiUrl}/${id}`,
      datos,
    );
  }

  eliminar(id: number): Observable<Instructor> {
    return this.http.delete<Instructor>(
      `${this.apiUrl}/${id}`,
    );
  }
}
