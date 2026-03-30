import { Injectable, inject, signal } from '@angular/core';

import {
  FWBRecord,
  FWBRecordList,
  DuplicateRecord,
  GetFWBReportsParams,
} from '@app/features/reports/models/interfaces';
import { ReportsQueryParamsService } from './reports-query-params.service';

@Injectable()
export class ReportsStoreService {
  private readonly queryParams = inject(ReportsQueryParamsService);

  private readonly reportsList = signal<FWBRecordList | null>(null);
  private readonly isLoading = signal<boolean>(true);

  private readonly expandedRowId = signal<number | null>(null);
  private readonly duplicates = signal<DuplicateRecord[]>([]);
  private duplicateIdCounter = 0;

  private readonly filters = signal<GetFWBReportsParams>(this.queryParams.readQueryParams());

  public readonly reportsListSignal = this.reportsList.asReadonly();
  public readonly isLoadingSignal = this.isLoading.asReadonly();
  public readonly expandedRowIdSignal = this.expandedRowId.asReadonly();
  public readonly duplicatesSignal = this.duplicates.asReadonly();
  public readonly filtersSignal = this.filters.asReadonly();

  public setReportsList(data: FWBRecordList | null): void {
    this.reportsList.set(data);
  }

  public setIsLoading(data: boolean): void {
    this.isLoading.set(data);
  }

  public syncQueryParams(): void {
    this.queryParams.updateQueryParams(this.filters());
  }

  public updateFilters(next: GetFWBReportsParams): void {
    this.queryParams.updateQueryParams(next);
    this.filters.set(next);
  }

  public toggleRow(sequence: number): void {
    const current = this.expandedRowId();
    this.expandedRowId.set(current === sequence ? null : sequence);
  }

  public addDuplicate(record: FWBRecord): void {
    const current = this.duplicates();
    const alreadyAdded = current.some((item) => item.record.fWB_Details.Sequence === record.fWB_Details.Sequence);

    if (alreadyAdded) return;

    this.duplicates.set([
      ...current,
      { id: ++this.duplicateIdCounter, record, expanded: false },
    ]);
  }

  public removeDuplicate(id: number): void {
    this.duplicates.set(this.duplicates().filter((item) => item.id !== id));
  }

  public toggleDuplicate(id: number): void {
    const current = this.duplicates();
    const index = current.findIndex((item) => item.id === id);

    if (index === -1) return;

    const next = [...current];
    next[index] = { ...next[index], expanded: !next[index].expanded };
    this.duplicates.set(next);
  }
}
