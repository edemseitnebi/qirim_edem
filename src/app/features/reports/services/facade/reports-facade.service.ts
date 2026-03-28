import { Injectable, inject, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { FWBRecordList, GetFWBReportsParams } from '@app/features/reports/services/api/type';
import { FWBRecord } from '@app/features/reports/services/api/type';
import { ReportsApiService } from '@app/features/reports/services/api/reports-api.service';
import { ReportsFiltersService } from './reports-filters.service';
import { DEFAULT_FILTERS, DuplicateRecord, ReportSortName, ReportSortOrder } from './type';

@Injectable({ providedIn: 'root' })
export class ReportsFacadeService {
  private readonly api = inject(ReportsApiService);
  private readonly filtersService = inject(ReportsFiltersService);
  private readonly loadingSubject = new BehaviorSubject<boolean>(true);
  private readonly filters$: Observable<GetFWBReportsParams>;
  private readonly expandedRowIdSubject = new BehaviorSubject<number | null>(null);
  private readonly duplicatesSubject = new BehaviorSubject<DuplicateRecord[]>([]);
  private duplicateIdCounter = 0;
  private readonly reports$: Observable<FWBRecordList | null>;

  public readonly filters: Signal<GetFWBReportsParams>;
  public readonly loading: Signal<boolean>;
  public readonly recordsList: Signal<FWBRecordList | null | undefined>;
  public readonly expandedRowId: Signal<number | null>;
  public readonly duplicates: Signal<DuplicateRecord[]>;

  constructor() {
    this.filters$ = toObservable(this.filtersService.filters);
    this.reports$ = this.filters$.pipe(
      distinctUntilChanged(this.paramsEqual),
      tap(() => this.loadingSubject.next(true)),
      switchMap((params) => this.api.getFWBReports(params)),
      tap(() => this.loadingSubject.next(false)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.filters = this.filtersService.filters.asReadonly();
    this.loading = toSignal(this.loadingSubject.asObservable(), {
      initialValue: true,
    });
    this.recordsList = toSignal<FWBRecordList | null | undefined>(this.reports$, {
      initialValue: undefined,
    });
    this.expandedRowId = toSignal(this.expandedRowIdSubject.asObservable(), {
      initialValue: null,
    });
    this.duplicates = toSignal(this.duplicatesSubject.asObservable(), {
      initialValue: [],
    });
  }

  public applyFilters(partial: Partial<GetFWBReportsParams>): void {
    this.filtersService.updateFilters({ ...this.filters(), ...partial });
  }

  public syncQueryParamsOnInit(): void {
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
    this.applyFilters({
      pageNumber: 1,
      from,
      until,
    });
  }

  public toggleRow(sequence: number): void {
    const current = this.expandedRowIdSubject.value;
    this.expandedRowIdSubject.next(current === sequence ? null : sequence);
  }

  public addDuplicate(record: FWBRecord): void {
    const currentDuplicates = this.duplicatesSubject.value;
    const recordSequence = record.fWB_Details.Sequence;
    const alreadyAdded = currentDuplicates.some((item) => item.record.fWB_Details.Sequence === recordSequence);

    if (alreadyAdded) {
      return;
    }

    const duplicateItem: DuplicateRecord = {
      id: ++this.duplicateIdCounter,
      record,
      expanded: false,
    };
    this.duplicatesSubject.next([...currentDuplicates, duplicateItem]);
  }

  public removeDuplicate(id: number): void {
    this.duplicatesSubject.next(this.duplicatesSubject.value.filter((item) => item.id !== id));
  }

  public toggleDuplicate(id: number): void {
    const currentDuplicates = this.duplicatesSubject.value;
    const targetIndex = currentDuplicates.findIndex((duplicateItem) => duplicateItem.id === id);

    if (targetIndex === -1) {
      return;
    }

    const nextDuplicates = [...currentDuplicates];
    const targetDuplicate = nextDuplicates[targetIndex];

    nextDuplicates[targetIndex] = {
      ...targetDuplicate,
      expanded: !targetDuplicate.expanded,
    };

    this.duplicatesSubject.next(nextDuplicates);
  }

  public resetFilters(): void {
    this.filtersService.updateFilters(DEFAULT_FILTERS);
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
