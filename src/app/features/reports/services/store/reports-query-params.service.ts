import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { GetFWBReportsParams } from '@app/features/reports/models/interfaces';
import { DEFAULT_FILTERS, PARAM_KEYS } from '@app/features/reports/models/constants';

// фильтры пишутся в url чтобы юзеры могли делиться ссылками
@Injectable()
export class ReportsQueryParamsService {
  private readonly router = inject(Router);

  readQueryParams(): GetFWBReportsParams {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    return {
      pageNumber: queryParams[PARAM_KEYS.pageNumber] ? Number(queryParams[PARAM_KEYS.pageNumber]) : DEFAULT_FILTERS.pageNumber,
      pageSize: queryParams[PARAM_KEYS.pageSize] ? Number(queryParams[PARAM_KEYS.pageSize]) : DEFAULT_FILTERS.pageSize,
      sortOrder: queryParams[PARAM_KEYS.sortOrder] ?? DEFAULT_FILTERS.sortOrder,
      sortName: queryParams[PARAM_KEYS.sortName] ?? DEFAULT_FILTERS.sortName,
      from: queryParams[PARAM_KEYS.from] ?? DEFAULT_FILTERS.from,
      until: queryParams[PARAM_KEYS.until] ?? DEFAULT_FILTERS.until,
    };
  }

  updateQueryParams(params: GetFWBReportsParams): void {
    const queryParams: Record<string, string | number> = {
      [PARAM_KEYS.pageNumber]: params.pageNumber,
      [PARAM_KEYS.pageSize]: params.pageSize,
    };

    if (params.sortOrder) queryParams[PARAM_KEYS.sortOrder] = params.sortOrder;
    if (params.sortName) queryParams[PARAM_KEYS.sortName] = params.sortName;
    if (params.from) queryParams[PARAM_KEYS.from] = params.from;
    if (params.until) queryParams[PARAM_KEYS.until] = params.until;

    void this.router.navigate([], {
      queryParams,
      queryParamsHandling: '',
      replaceUrl: true,
    });
  }
}
