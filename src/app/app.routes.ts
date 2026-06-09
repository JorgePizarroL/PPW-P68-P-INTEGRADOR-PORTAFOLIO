import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'programador/:slug',
    loadComponent: () => import('./pages/perfil/perfil').then(m => m.PerfilComponent)
  },
  {
    path: 'solicitudes',
    loadComponent: () => import('./pages/solicitudes/solicitudes').then(m => m.SolicitudesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
