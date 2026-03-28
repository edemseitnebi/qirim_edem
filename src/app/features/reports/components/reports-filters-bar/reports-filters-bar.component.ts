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

  protected onDateInputChange(field: 'from' | 'until', value: Date | null | undefined): void {
    this.dateRangeChange.emit({
      fromDate: field === 'from' ? (value ?? null) : this.dateRange.fromDate,
      untilDate: field === 'until' ? (value ?? null) : this.dateRange.untilDate,
    });
  }
}
