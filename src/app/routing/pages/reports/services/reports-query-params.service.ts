import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import type { GetFWBReportsParams } from '../../../../api/rest/reports/type';

@Injectable({ providedIn: 'root' })
export class ReportsQueryParamsService {
  private readonly router = inject(Router);

  updateQueryParams(params: GetFWBReportsParams): void {
    void this.router.navigate([], {
      queryParams: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        sortOrder: params.sortOrder ?? '',
        sortName: params.sortName ?? '',
        from: params.from ?? '',
        until: params.until ?? '',
      },
      queryParamsHandling: '',
      replaceUrl: true,
    });
  }
}

