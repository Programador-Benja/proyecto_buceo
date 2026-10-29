import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Escuela {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CrearEscuela {
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activa?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EscuelasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/escuelas';

  obtenerTodas(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Escuela> {
    return this.http.get<Escuela>(`${this.apiUrl}/${id}`);
  }

  crear(datos: CrearEscuela): Observable<Escuela> {
    return this.http.post<Escuela>(this.apiUrl, datos);
  }

  actualizar(
    id: number,
    datos: Partial<CrearEscuela>,
  ): Observable<Escuela> {
    return this.http.patch<Escuela>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<Escuela> {
    return this.http.delete<Escuela>(`${this.apiUrl}/${id}`);
  }
}
