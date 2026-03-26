import { Injectable, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, distinctUntilChanged, shareReplay, switchMap, tap } from 'rxjs';

import type { FWBRecordList, GetFWBReportsParams } from '../../../../api/rest/reports/type';
import { ReportsRestService } from '../../../../api/rest/reports/rest';
import { ReportsFiltersService } from './reports-filters.service';

@Injectable({ providedIn: 'root' })
export class ReportsFacadeService {
  private readonly rest = inject(ReportsRestService);
  private readonly filtersService = inject(ReportsFiltersService);
  private readonly loadingSubject = new BehaviorSubject<boolean>(true);
  private readonly filters$ = toObservable(this.filtersService.filters);

  private readonly reports$ = this.filters$.pipe(
    distinctUntilChanged(this.paramsEqual),
    tap(() => this.loadingSubject.next(true)),
    switchMap((params) => this.rest.getFWBReports(params)),
    tap(() => this.loadingSubject.next(false)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly filters = this.filtersService.filters.asReadonly();
  readonly loading = toSignal(this.loadingSubject.asObservable(), { initialValue: true });
  readonly reportData = toSignal<FWBRecordList | null | undefined>(this.reports$, {
    initialValue: undefined,
  });

  applyFilters(partial: Partial<GetFWBReportsParams>): void {
    this.filtersService.updateFilters({ ...this.filters(), ...partial });
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

