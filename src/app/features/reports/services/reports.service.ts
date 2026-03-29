//фасад для reports
import { Injectable, inject } from '@angular/core';

import { FWBRecord, GetFWBReportsParams } from '@app/features/reports/models/interfaces';
import { ReportSortName, ReportSortOrder } from '@app/features/reports/models/types';
import { DEFAULT_FILTERS } from '@app/features/reports/models/constants';
import { ReportsStoreService } from './store/reports-store.service';
import { ReportsFiltersService } from './store/reports-filters.service';

@Injectable()
export class ReportsService {
  private readonly store = inject(ReportsStoreService);
  private readonly filtersService = inject(ReportsFiltersService);

  public readonly loadingSignal = this.store.loadingSignal;
  public readonly recordsListSignal = this.store.recordsListSignal;
  public readonly expandedRowIdSignal = this.store.expandedRowIdSignal;
  public readonly duplicatesListSignal = this.store.duplicatesSignal;
  public readonly filtersSignal = this.filtersService.filtersSignal.asReadonly();

  public syncUrlParams(): void {
    this.filtersService.syncQueryParams();
  }

  public setSortState(sortName: ReportSortName | '', sortOrder: ReportSortOrder): void {
    this.applyFilters({
      pageNumber: 1,
      sortName: sortOrder ? sortName : '',
      sortOrder,
    });
  }

  public setPage(pageIndex: number, pageSize: number): void {
    this.applyFilters({
      pageNumber: pageIndex + 1,
      pageSize,
    });
  }

  public setDateRange(from: string, until: string): void {
    this.applyFilters({ pageNumber: 1, from, until });
  }

  public resetFilters(): void {
    this.filtersService.updateFilters(DEFAULT_FILTERS);
  }

  public toggleRow(sequence: number): void {
    this.store.toggleRow(sequence);
  }

  public addDuplicate(record: FWBRecord): void {
    this.store.addDuplicate(record);
  }

  public removeDuplicate(id: number): void {
    this.store.removeDuplicate(id);
  }

  public toggleDuplicate(id: number): void {
    this.store.toggleDuplicate(id);
  }

  private applyFilters(partial: Partial<GetFWBReportsParams>): void {
    this.filtersService.updateFilters({ ...this.filtersSignal(), ...partial });
  }
}
