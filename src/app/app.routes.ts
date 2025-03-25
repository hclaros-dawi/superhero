import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    //importa y carga componente de lo que se ha importado con then
    loadComponent: () =>import('../componentes/home/home.component').then(comp => comp.HomeComponent)
  },
  {
    path: 'mensaje',
    loadComponent: () => import('../componentes/mensaje/mensaje.component').then(comp => comp.MensajeComponent)
  },
  {
    path: 'editar',
    loadComponent: () => import('../componentes/editar/editar.component').then(comp => comp.EditarComponent)
  },
  {
    path: 'eliminar',
    loadComponent: () => import('../componentes/eliminar/eliminar.component').then(comp => comp.EliminarComponent)
  },
  {
    path: 'crear',
    loadComponent: () => import('../componentes/crear/crear.component').then(comp => comp.CrearComponent)
  }
];
