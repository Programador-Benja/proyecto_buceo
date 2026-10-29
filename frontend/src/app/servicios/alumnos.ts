import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  contactoEmergencia: string | null;
  telefonoEmergencia: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CrearAlumno = Omit<
  Alumno,
  'id' | 'createdAt' | 'updatedAt'
>;

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/alumnos';

  obtenerTodos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
  }

  crear(datos: Partial<CrearAlumno>): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, datos);
  }

  actualizar(
    id: number,
    datos: Partial<CrearAlumno>,
  ): Observable<Alumno> {
    return this.http.patch<Alumno>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<Alumno> {
    return this.http.delete<Alumno>(`${this.apiUrl}/${id}`);
  }
}
