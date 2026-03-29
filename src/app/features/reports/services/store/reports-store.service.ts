import { Injectable, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { FWBRecord, FWBRecordList, GetFWBReportsParams, DuplicateRecord } from '@app/features/reports/models/interfaces';
import { ReportsApiService } from '@app/features/reports/services/api/reports-api.service';
import { ReportsFiltersService } from '@app/features/reports/services/store/reports-filters.service';

@Injectable()
export class ReportsStoreService {
  private readonly api = inject(ReportsApiService);
  private readonly filtersService = inject(ReportsFiltersService);

  private readonly loadingSubject = new BehaviorSubject<boolean>(true);
  private readonly expandedRowIdSubject = new BehaviorSubject<number | null>(null);
  private readonly duplicatesSubject = new BehaviorSubject<DuplicateRecord[]>([]);
  private duplicateIdCounter = 0;

  private readonly filters$: Observable<GetFWBReportsParams> = toObservable(this.filtersService.filtersSignal);
  private readonly reports$: Observable<FWBRecordList | null> = this.filters$.pipe(
    distinctUntilChanged(this.paramsEqual),
    tap(() => this.loadingSubject.next(true)),
    switchMap((params) => this.api.getFWBReports(params)),
    tap(() => this.loadingSubject.next(false)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public readonly loadingSignal = toSignal(this.loadingSubject.asObservable(), { initialValue: true });
  public readonly recordsListSignal = toSignal<FWBRecordList | null | undefined>(this.reports$, { initialValue: undefined });
  public readonly expandedRowIdSignal = toSignal(this.expandedRowIdSubject.asObservable(), { initialValue: null });
  public readonly duplicatesSignal = toSignal(this.duplicatesSubject.asObservable(), { initialValue: [] });

  public toggleRow(sequence: number): void {
    const current = this.expandedRowIdSubject.value;
    this.expandedRowIdSubject.next(current === sequence ? null : sequence);
  }

  public addDuplicate(record: FWBRecord): void {
    const current = this.duplicatesSubject.value;
    const alreadyAdded = current.some((item) => item.record.fWB_Details.Sequence === record.fWB_Details.Sequence);

    if (alreadyAdded) return;

    this.duplicatesSubject.next([
      ...current,
      { id: ++this.duplicateIdCounter, record, expanded: false },
    ]);
  }

  public removeDuplicate(id: number): void {
    this.duplicatesSubject.next(this.duplicatesSubject.value.filter((item) => item.id !== id));
  }

  public toggleDuplicate(id: number): void {
    const current = this.duplicatesSubject.value;
    const index = current.findIndex((item) => item.id === id);

    if (index === -1) return;

    const next = [...current];
    next[index] = { ...next[index], expanded: !next[index].expanded };
    this.duplicatesSubject.next(next);
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
