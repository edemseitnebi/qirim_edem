import { Injectable, inject, signal } from '@angular/core';

import { GetFWBReportsParams } from '@app/features/reports/services/api/type';
import { ReportsQueryParamsService } from './reports-query-params.service';
import { DEFAULT_FILTERS } from './type';

@Injectable({ providedIn: 'root' })
export class ReportsFiltersService {
  private readonly queryParams = inject(ReportsQueryParamsService);
  readonly filters = signal<GetFWBReportsParams>(DEFAULT_FILTERS);

  syncQueryParams(): void {
    this.queryParams.updateQueryParams(this.filters());
  }

  updateFilters(next: GetFWBReportsParams): void {
    this.queryParams.updateQueryParams(next);
    this.filters.set(next);
  }
}
