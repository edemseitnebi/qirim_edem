//фасад для reports
import { DestroyRef, Injectable, inject } from '@angular/core';

import { FWBRecord, GetFWBReportsParams } from '@app/features/reports/models/interfaces';
import { ReportSortName, ReportSortOrder } from '@app/features/reports/models/types';
import { ReportsStoreService } from './store/reports-store.service';
import { ReportsFiltersService } from './store/reports-filters.service';
import { distinctUntilChanged, finalize, Observable, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReportsApiService } from '@app/features/reports/services/api/reports-api.service';

@Injectable()
export class ReportsService {
  private readonly store = inject(ReportsStoreService);
  private readonly filtersService = inject(ReportsFiltersService);
  private readonly apiService = inject(ReportsApiService);

  private readonly destroyRef = inject(DestroyRef);

  public readonly loadingSignal = this.store.isLoadingSignal;
  public readonly recordsListSignal = this.store.reportsListSignal;
  public readonly expandedRowIdSignal = this.store.expandedRowIdSignal;
  public readonly duplicatesListSignal = this.store.duplicatesSignal;
  public readonly filtersSignal = this.filtersService.filtersSignal.asReadonly();

  private readonly filters$: Observable<GetFWBReportsParams> = toObservable(this.filtersService.filtersSignal);

  public getAllReports(): void {
    this.filters$.pipe(
      distinctUntilChanged(this.paramsEqual),
      switchMap((params) => {
        this.store.setIsLoading(true);
        return this.apiService.getFWBReports(params).pipe(
          finalize(() => this.store.setIsLoading(false)),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((reports) => this.store.setReportsList(reports));
  }

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

  private applyFilters(params: Partial<GetFWBReportsParams>): void {
    this.filtersService.updateFilters({ ...this.filtersSignal(), ...params });
  }

  private paramsEqual(a: GetFWBReportsParams, b: GetFWBReportsParams): boolean {
    return (
      a.pageNumber === b.pageNumber &&
      a.pageSize === b.pageSize &&
      (a.sortOrder ?? '') === (b.sortOrder ?? '') &&
      (a.sortName ?? '') === (b.sortName ?? '') &&
      (a.from ?? '') === (b.from ?? '') &&
      (a.until ?? '') === (b.until ?? '')
    );
  }
}
