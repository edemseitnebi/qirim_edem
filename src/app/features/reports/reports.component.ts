import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { FWBRecord, FWBRecordList, GetFWBReportsParams } from '@app/features/reports/services/api/type';
import { DuplicatesPanelComponent } from './components/duplicates-panel/duplicates-panel.component';
import { ReportItemComponent } from './components/report-item/report-item.component';
import { ReportsFiltersBarComponent } from './components/reports-filters-bar/reports-filters-bar.component';
import { ReportsPaginationComponent } from './components/reports-pagination/reports-pagination.component';
import { ReportsFacadeService } from './services/facade/reports-facade.service';
import { DuplicateRecord, DuplicatesPanelAction, PaginatorData, ReportRowData, ReportsDateRangeData, ReportSortName } from './services/facade/type';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    DragDropModule,
    MatCardModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    DuplicatesPanelComponent,
    ReportItemComponent,
    ReportsFiltersBarComponent,
    ReportsPaginationComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
})
export class ReportsComponent implements OnInit {
  private readonly facade = inject(ReportsFacadeService);
  protected readonly dateRange = signal<ReportsDateRangeData>({
    fromDate: null,
    untilDate: null,
  });
  protected readonly loading: Signal<boolean> = this.facade.loading;
  protected readonly recordsData: Signal<FWBRecordList | null | undefined> = this.facade.recordsList;
  protected readonly filters: Signal<GetFWBReportsParams> = this.facade.filters;
  protected readonly expandedRowId: Signal<number | null> = this.facade.expandedRowId;
  protected readonly duplicates: Signal<DuplicateRecord[]> = this.facade.duplicates;

  protected get sortDirection(): SortDirection {
    const sortOrder = this.filters().sortOrder;
    return sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : '';
  }

  protected get isLoading(): boolean {
    return this.loading();
  }

  protected get activeSortName(): ReportSortName | '' {
    const sortName = this.filters().sortName ?? '';
    return this.isReportSortName(sortName) ? sortName : '';
  }

  protected get currentPage(): number {
    return this.filters().pageNumber;
  }

  protected get totalPages(): number {
    const totalRecords = this.recordsData()?.totalRecords ?? 0;
    const pageSize = this.filters().pageSize;

    if (!totalRecords || !pageSize) {
      return 1;
    }

    return Math.max(1, Math.ceil(totalRecords / pageSize));
  }

  protected get paginatorData(): PaginatorData {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      pageSize: this.filters().pageSize,
      pageSizeOptions: [10, 25, 50],
    };
  }

  protected get dateRangeData(): ReportsDateRangeData {
    return this.dateRange();
  }

  protected get duplicatesData(): DuplicateRecord[] {
    return this.duplicates();
  }

  public ngOnInit(): void {
    this.facade.syncQueryParamsOnInit();
  }

  protected onMatSort(event: Sort): void {
    if (!this.isReportSortName(event.active) || (event.direction !== 'asc' && event.direction !== 'desc')) {
      this.facade.setSortState('', '');
      return;
    }
    this.facade.setSortState(event.active, event.direction);
  }

  protected applyDateRange(): void {
    const dateRange = this.dateRange();
    this.facade.setDateRange(this.formatDate(dateRange.fromDate), this.formatDate(dateRange.untilDate));
  }

  protected clearDateRange(): void {
    this.dateRange.set({
      fromDate: null,
      untilDate: null,
    });
    this.facade.setDateRange('', '');
  }

  protected onDateRangeChange(dateRange: ReportsDateRangeData): void {
    this.dateRange.set(dateRange);
  }

  protected buildRowData(item: FWBRecord): ReportRowData {
    return {
      item,
      expanded: this.expandedRowId() === item.fWB_Details.Sequence,
    };
  }

  protected toggleRow(sequence: number): void {
    this.facade.toggleRow(sequence);
  }

  protected onRowClick(sequence: number): void {
    this.toggleRow(sequence);
  }

  protected onDuplicatesAction(action: DuplicatesPanelAction): void {
    if (action.type === 'drop') {
      this.facade.addDuplicate(action.record);
      return;
    }

    if (action.type === 'toggle') {
      this.facade.toggleDuplicate(action.id);
      return;
    }

    this.facade.removeDuplicate(action.id);
  }

  protected onPageChange(page: number): void {
    this.facade.setPage(page - 1, this.filters().pageSize);
  }

  protected onPageSizeChange(pageSize: number): void {
    this.facade.setPage(0, pageSize);
  }

  private formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    return date.toISOString().replace('Z', '+00:00');
  }

  private isReportSortName(value: string): value is ReportSortName {
    return (
      value === 'prefix' ||
      value === 'serial' ||
      value === 'origin' ||
      value === 'destination' ||
      value === 'act_weight' ||
      value === 'unit'
    );
  }
}
