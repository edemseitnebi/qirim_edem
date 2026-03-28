import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PaginatorData } from '@app/features/reports/services/facade/type';

@Component({
  selector: 'app-reports-pagination',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './reports-pagination.component.html',
  styleUrl: './reports-pagination.component.scss',
})
export class ReportsPaginationComponent {
  @Input({ required: true }) public paginatorData!: PaginatorData;
  @Output() public readonly pageChange = new EventEmitter<number>();
  @Output() public readonly pageSizeChange = new EventEmitter<number>();

  protected get currentPage(): number {
    return this.paginatorData.currentPage;
  }

  protected get totalPages(): number {
    return this.paginatorData.totalPages;
  }

  protected get pageSize(): number {
    return this.paginatorData.pageSize;
  }

  protected get pageSizeOptions(): number[] {
    return this.paginatorData.pageSizeOptions;
  }

  protected get visiblePages(): (number | 'dots')[] {
    const total = Math.max(1, this.totalPages);
    const current = Math.min(Math.max(1, this.currentPage), total);

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
  }

  protected get canGoPrev(): boolean {
    return this.currentPage > 1;
  }

  protected get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  protected isCurrentPage(page: number): boolean {
    return this.currentPage === page;
  }

  protected onPageSizeSelectionChange(value: number | null | undefined): void {
    this.onPageSizeChanged(value ?? 0);
  }

  protected onPrevKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.goPrev();
  }

  protected onNextKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.goNext();
  }

  protected onPageKeydown(event: KeyboardEvent, page: number): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.goToPage(page);
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);
  }

  protected goPrev(): void {
    this.goToPage(this.currentPage - 1);
  }

  protected goNext(): void {
    this.goToPage(this.currentPage + 1);
  }

  protected onPageSizeChanged(nextPageSize: number): void {
    if (!nextPageSize || nextPageSize === this.pageSize) {
      return;
    }

    this.pageSizeChange.emit(nextPageSize);
  }
}
