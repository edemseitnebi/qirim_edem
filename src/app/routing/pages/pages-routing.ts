import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'reports',
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports').then((m) => m.Reports),
  },
  {
    path: '**',
    redirectTo: 'reports',
  },
];
