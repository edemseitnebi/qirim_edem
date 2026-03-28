import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideRouter(routes),
  ],
};
