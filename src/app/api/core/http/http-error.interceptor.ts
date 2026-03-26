import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../notifications/notification.service';

function messageFromHttpError(err: HttpErrorResponse): string {
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
    return 'Network error';
  }
  return err.message || `Error ${err.status}`;
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        notifications.error(messageFromHttpError(err));
      } else if (err instanceof Error) {
        notifications.error(err.message);
      } else {
        notifications.error('Request failed');
      }
      return throwError(() => err);
    }),
  );
};
