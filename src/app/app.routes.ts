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
      import('./features/reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: '**',
    redirectTo: 'reports',
  },
];
