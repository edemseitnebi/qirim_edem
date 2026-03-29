import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReportsDateRangeData } from '@app/features/reports/models/interfaces';

@Component({
  selector: 'app-reports-filters-bar',
  standalone: true,
  imports: [MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './reports-filters-bar.component.html',
  styleUrl: './reports-filters-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsFiltersBarComponent {
  public readonly dateRange = input.required<ReportsDateRangeData>();
  public readonly dateRangeChange = output<ReportsDateRangeData>();
  public readonly apply = output<void>();
  public readonly clearRange = output<void>();

  protected readonly hasDateRangeValueSignal = computed(
    () => !!this.dateRange().fromDate || !!this.dateRange().untilDate,
  );

  protected clearDateRange(event: Event): void {
    event.stopPropagation();
    this.clearRange.emit();
  }

  protected onDateInputChange(field: 'from' | 'until', value: Date | null | undefined): void {
    const current = this.dateRange();
    this.dateRangeChange.emit({
      fromDate: field === 'from' ? (value ?? null) : current.fromDate,
      untilDate: field === 'until' ? (value ?? null) : current.untilDate,
    });
  }
}
