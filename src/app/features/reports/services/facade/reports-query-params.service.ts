import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { GetFWBReportsParams } from '@app/features/reports/services/api/type';

@Injectable({ providedIn: 'root' })
export class ReportsQueryParamsService {
  private readonly router = inject(Router);

  updateQueryParams(params: GetFWBReportsParams): void {
    const queryParams: Record<string, string | number> = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    };

    if (params.sortOrder) {
      queryParams['sortOrder'] = params.sortOrder;
    }

    if (params.sortName) {
      queryParams['SortName'] = params.sortName;
    }

    if (params.from) {
      queryParams['from'] = params.from;
    }

    if (params.until) {
      queryParams['until'] = params.until;
    }

    void this.router.navigate([], {
      queryParams,
      queryParamsHandling: '',
      replaceUrl: true,
    });
  }
}
