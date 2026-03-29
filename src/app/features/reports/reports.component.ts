import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { FWBRecord, ReportRowData, ReportsDateRangeData } from '@app/features/reports/models/interfaces';
import { DuplicatesPanelAction, ReportSortName } from '@app/features/reports/models/types';
import { DuplicatesPanelComponent } from './components/duplicates-panel/duplicates-panel.component';
import { ReportItemComponent } from './components/report-item/report-item.component';
import { ReportsFiltersBarComponent } from './components/reports-filters-bar/reports-filters-bar.component';
import { ReportsPaginationComponent } from './components/reports-pagination/reports-pagination.component';
import { ReportsService } from './services/reports.service';
import { ReportsStoreService } from './services/store/reports-store.service';
import { ReportsFiltersService } from './services/store/reports-filters.service';
import { ReportsQueryParamsService } from './services/store/reports-query-params.service';
import { ReportsApiService } from './services/api/reports-api.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ReportsQueryParamsService,
    ReportsFiltersService,
    ReportsApiService,
    ReportsStoreService,
    ReportsService,
  ],
})
export class ReportsComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);

  protected readonly isLoadingSignal = this.reportsService.loadingSignal;
  protected readonly recordsDataSignal = this.reportsService.recordsListSignal;
  protected readonly filtersSignal = this.reportsService.filtersSignal;
  protected readonly expandedRowsIdSignal = this.reportsService.expandedRowIdSignal;
  protected readonly duplicatesSignal = this.reportsService.duplicatesListSignal;

  protected readonly dateRangeSignal = signal<ReportsDateRangeData>({ fromDate: null, untilDate: null });

  protected readonly sortDirectionSignal = computed<SortDirection>(() => {
    const sortOrder = this.filtersSignal().sortOrder;
    return sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : '';
  });

  protected readonly activeSortNameSignal = computed<ReportSortName | ''>(() => {
    const sortName = this.filtersSignal().sortName ?? '';
    return this.isReportSortName(sortName) ? sortName : '';
  });

  protected readonly paginatorDataSignal = computed(() => {
    const filters = this.filtersSignal();
    const totalRecords = this.recordsDataSignal()?.totalRecords ?? 0;
    const totalPages = !totalRecords || !filters.pageSize
      ? 1
      : Math.max(1, Math.ceil(totalRecords / filters.pageSize));

    return {
      currentPage: filters.pageNumber,
      totalPages,
      pageSize: filters.pageSize,
      pageSizeOptions: [10, 25, 50],
    };
  });

  public ngOnInit(): void {
    this.reportsService.syncUrlParams();
    this.initDateRangeFromFilters();
  }

  protected onMatSort(event: Sort): void {
    if (!this.isReportSortName(event.active) || (event.direction !== 'asc' && event.direction !== 'desc')) {
      this.reportsService.setSortState('', '');
      return;
    }
    this.reportsService.setSortState(event.active, event.direction);
  }

  protected applyDateRange(): void {
    const { fromDate, untilDate } = this.dateRangeSignal();
    this.reportsService.setDateRange(this.formatDate(fromDate), this.formatDate(untilDate));
  }

  protected clearDateRange(): void {
    this.dateRangeSignal.set({ fromDate: null, untilDate: null });
    this.reportsService.setDateRange('', '');
  }

  protected onDateRangeChange(dateRange: ReportsDateRangeData): void {
    this.dateRangeSignal.set(dateRange);
  }

  protected buildRowData(item: FWBRecord): ReportRowData {
    return {
      item,
      expanded: this.expandedRowsIdSignal() === item.fWB_Details.Sequence,
    };
  }

  protected toggleRow(sequence: number): void {
    this.reportsService.toggleRow(sequence);
  }

  protected onDuplicatesAction(action: DuplicatesPanelAction): void {
    if (action.type === 'drop') {
      this.reportsService.addDuplicate(action.record);
      return;
    }
    if (action.type === 'toggle') {
      this.reportsService.toggleDuplicate(action.id);
      return;
    }
    this.reportsService.removeDuplicate(action.id);
  }

  protected onPageChange(page: number): void {
    this.reportsService.setPage(page - 1, this.filtersSignal().pageSize);
  }

  protected onPageSizeChange(pageSize: number): void {
    this.reportsService.setPage(0, pageSize);
  }

  private formatDate(date: Date | null): string {
    return date ? date.toISOString().replace('Z', '+00:00') : '';
  }

  private initDateRangeFromFilters(): void {
    const { from, until } = this.filtersSignal();
    this.dateRangeSignal.set({
      fromDate: from ? new Date(from) : null,
      untilDate: until ? new Date(until) : null,
    });
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
