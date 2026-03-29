import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

import { ReportRowData } from '@app/features/reports/models/interfaces';

@Component({
  selector: 'app-report-item',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, DatePipe, JsonPipe, MatIconModule],
  templateUrl: './report-item.component.html',
  styleUrl: './report-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportItemComponent {
  public readonly rowData = input.required<ReportRowData>();
  public readonly rowClick = output<number>();

  protected readonly isHighlightedSignal = computed(() => !!this.rowData().item.agent_Details);
  protected readonly expandIconSignal = computed<'expand_less' | 'expand_more'>(() =>
    this.rowData().expanded ? 'expand_less' : 'expand_more',
  );

  protected onDragHandleClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onRowKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' ) return;
    event.preventDefault();
    this.onRowClicked();
  }

  protected onRowClicked(): void {
    this.rowClick.emit(this.rowData().item.fWB_Details.Sequence);
  }
}
