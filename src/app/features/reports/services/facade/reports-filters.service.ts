import { Injectable, inject, signal } from '@angular/core';

import { GetFWBReportsParams } from '@app/features/reports/services/api/type';
import { ReportsQueryParamsService } from './reports-query-params.service';

@Injectable({ providedIn: 'root' })
export class ReportsFiltersService {
  private readonly queryParams = inject(ReportsQueryParamsService);
  readonly filters = signal<GetFWBReportsParams>(this.queryParams.readQueryParams());

  syncQueryParams(): void {
    this.queryParams.updateQueryParams(this.filters());
  }

  updateFilters(next: GetFWBReportsParams): void {
    this.queryParams.updateQueryParams(next);
    this.filters.set(next);
  }
}
