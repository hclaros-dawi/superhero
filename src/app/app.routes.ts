import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    //importa y carga componente de lo que se ha importado con then
    loadComponent: () => import('../componentes/home/home.component').then(comp => comp.HomeComponent)
  }
];
