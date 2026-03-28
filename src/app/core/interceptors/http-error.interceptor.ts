import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

function httpErrorMessage(err: HttpErrorResponse): string {
  if (err.error instanceof Error) {
    return err.error.message;
  }
  if (typeof err.error === 'string') {
    return err.error;
  }
  if (err.error && typeof err.error === 'object' && 'message' in err.error) {
    const m = (err.error as { message?: unknown }).message;
    if (typeof m === 'string') {
      return m;
    }
  }
  if (err.status === 0) {
    return 'error';
  }
  return err.message || `error ${err.status}`;
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        notifications.error(httpErrorMessage(err));
      } else if (err instanceof Error) {
        notifications.error(err.message);
      } else {
        notifications.error('request failed');
      }
      return throwError(() => err);
    }),
  );
};
