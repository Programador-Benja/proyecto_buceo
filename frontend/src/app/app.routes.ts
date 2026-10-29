import { Routes } from '@angular/router';
import { Escuelas } from './paginas/escuelas/escuelas';
import { Instructores } from './paginas/instructores/instructores';

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
    path: '**',
    redirectTo: 'escuelas',
  },
];
