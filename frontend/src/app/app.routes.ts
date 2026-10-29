import { Routes } from '@angular/router';
import { Escuelas } from './paginas/escuelas/escuelas';
import { Instructores } from './paginas/instructores/instructores';
import { Alumnos } from './paginas/alumnos/alumnos';
import { Cursos } from './paginas/cursos/cursos';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'escuelas',
    pathMatch: 'full',
  },
  {
    path: 'escuelas',
    component: Escuelas,
  },
  {
    path: 'instructores',
    component: Instructores,
  },
  {
    path: 'alumnos',
    component: Alumnos,
  },
  {
    path: 'cursos',
    component: Cursos,
  },
  {
    path: '**',
    redirectTo: 'escuelas',
  },
];
