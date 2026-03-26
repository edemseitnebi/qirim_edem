import { Injectable, inject, signal } from '@angular/core';

import type { GetFWBReportsParams } from '../../../../api/rest/reports/type';
import { ReportsQueryParamsService } from './reports-query-params.service';

const DEFAULT_FILTERS: GetFWBReportsParams = {
  pageNumber: 1,
  pageSize: 10,
  sortOrder: 'asc',
  sortName: '',
  from: '',
  until: '',
};

@Injectable({ providedIn: 'root' })
export class ReportsFiltersService {
  private readonly queryParams = inject(ReportsQueryParamsService);
  readonly filters = signal<GetFWBReportsParams>(DEFAULT_FILTERS);

  updateFilters(next: GetFWBReportsParams): void {
    this.queryParams.updateQueryParams(next);
    this.filters.set(next);
  }
}

