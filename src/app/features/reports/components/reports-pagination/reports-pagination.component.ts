import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PaginatorData } from '@app/features/reports/models/interfaces';

@Component({
  selector: 'app-reports-pagination',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './reports-pagination.component.html',
  styleUrl: './reports-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPaginationComponent {
  public readonly paginatorData = input.required<PaginatorData>();
  public readonly pageChange = output<number>();
  public readonly pageSizeChange = output<number>();

  protected readonly canGoPrevSignal = computed(() => this.paginatorData().currentPage > 1);
  protected readonly canGoNextSignal = computed(() => this.paginatorData().currentPage < this.paginatorData().totalPages);

  protected readonly visiblePagesSignal = computed<(number | 'dots')[]>(() => {
    const total = Math.max(1, this.paginatorData().totalPages);
    const current = Math.min(Math.max(1, this.paginatorData().currentPage), total);

    if (total <= 5) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pages: (number | 'dots')[] = [1];

    let windowStart = Math.max(2, current - 1);
    let windowEnd = Math.min(total - 1, current + 1);

    if (current <= 3) {
      windowStart = 2;
      windowEnd = 4;
    } else if (current >= total - 2) {
      windowStart = total - 3;
      windowEnd = total - 1;
    }

    for (let page = windowStart; page <= windowEnd; page += 1) {
      pages.push(page);
    }

    if (windowEnd < total - 1) {
      pages.push('dots');
    }

    pages.push(total);
    return pages;
  });

  protected isCurrentPage(page: number): boolean {
    return this.paginatorData().currentPage === page;
  }

  protected onPageSizeSelectionChange(value: number | null | undefined): void {
    this.onPageSizeChanged(value ?? 0);
  }

  protected handleA11yKeydown(event: KeyboardEvent, action: 'prev' | 'next' | 'page', page?: number): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (action === 'prev') this.goPrev();
    else if (action === 'next') this.goNext();
    else if (page !== undefined) this.goToPage(page);
  }

  protected goToPage(page: number): void {
    const { currentPage, totalPages } = this.paginatorData();
    if (page < 1 || page > totalPages || page === currentPage) return;
    this.pageChange.emit(page);
  }

  protected goPrev(): void {
    this.goToPage(this.paginatorData().currentPage - 1);
  }

  protected goNext(): void {
    this.goToPage(this.paginatorData().currentPage + 1);
  }

  protected onPageSizeChanged(nextPageSize: number): void {
    if (!nextPageSize || nextPageSize === this.paginatorData().pageSize) return;
    this.pageSizeChange.emit(nextPageSize);
  }
}
