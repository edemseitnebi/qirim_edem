import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReportsDateRangeData } from '@app/features/reports/services/facade/type';

@Component({
  selector: 'app-reports-filters-bar',
  standalone: true,
  imports: [MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './reports-filters-bar.component.html',
  styleUrl: './reports-filters-bar.component.scss',
})
export class ReportsFiltersBarComponent {
  @Input({ required: true }) public dateRange!: ReportsDateRangeData;
  @Output() public readonly dateRangeChange = new EventEmitter<ReportsDateRangeData>();
  @Output() public readonly apply = new EventEmitter<void>();
  @Output() public readonly clearRange = new EventEmitter<void>();

  protected get hasDateRangeValue(): boolean {
    return !!this.dateRange.fromDate || !!this.dateRange.untilDate;
  }

  protected clearDateRange(event: Event): void {
    event.stopPropagation();
    this.clearRange.emit();
  }

  protected onApplyClick(): void {
    this.apply.emit();
  }

  protected onFromDateInputChange(value: Date | null | undefined): void {
    this.onFromDateChange(value ?? null);
  }

  protected onUntilDateInputChange(value: Date | null | undefined): void {
    this.onUntilDateChange(value ?? null);
  }

  protected onFromDateChange(fromDate: Date | null): void {
    this.dateRangeChange.emit({
      fromDate,
      untilDate: this.dateRange.untilDate,
    });
  }

  protected onUntilDateChange(untilDate: Date | null): void {
    this.dateRangeChange.emit({
      fromDate: this.dateRange.fromDate,
      untilDate,
    });
  }
}
