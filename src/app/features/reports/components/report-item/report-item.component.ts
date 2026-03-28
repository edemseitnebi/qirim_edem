import { DatePipe, JsonPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

import { ReportRowData } from '@app/features/reports/services/facade/type';

@Component({
  selector: 'app-report-item',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, DatePipe, JsonPipe, MatIconModule],
  templateUrl: './report-item.component.html',
  styleUrl: './report-item.component.scss',
})
export class ReportItemComponent {
  @Input({ required: true }) public rowData!: ReportRowData;
  @Output() public readonly rowClick = new EventEmitter<number>();

  protected get isHighlighted(): boolean {
    return !!this.rowData.item.agent_Details;
  }

  protected get expandIcon(): 'expand_less' | 'expand_more' {
    return this.rowData.expanded ? 'expand_less' : 'expand_more';
  }

  protected get volumeText(): number | string {
    return this.rowData.item.fWB_Details.Volume ?? '—';
  }

  protected onDragHandleClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onRowKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.onRowClicked();
  }

  protected onRowClicked(): void {
    this.rowClick.emit(this.rowData.item.fWB_Details.Sequence);
  }
}
