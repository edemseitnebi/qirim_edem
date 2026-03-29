import { Injectable, inject, signal } from '@angular/core';

import { GetFWBReportsParams } from '@app/features/reports/models/interfaces';
import { ReportsQueryParamsService } from './reports-query-params.service';

@Injectable()
export class ReportsFiltersService {
  private readonly queryParams = inject(ReportsQueryParamsService);
  readonly filtersSignal = signal<GetFWBReportsParams>(this.queryParams.readQueryParams());

  syncQueryParams(): void {
    this.queryParams.updateQueryParams(this.filtersSignal());
  }

  updateFilters(next: GetFWBReportsParams): void {
    this.queryParams.updateQueryParams(next);
    this.filtersSignal.set(next);
  }
}
