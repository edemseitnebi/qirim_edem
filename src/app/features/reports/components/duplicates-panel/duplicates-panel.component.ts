import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { FWBRecord } from '@app/features/reports/services/api/type';
import { DuplicateItemAction, DuplicateRecord, DuplicatesPanelAction } from '@app/features/reports/services/facade/type';
import { DuplicateItemComponent } from '../duplicate-item/duplicate-item.component';

@Component({
  selector: 'app-duplicates-panel',
  standalone: true,
  imports: [DragDropModule, DuplicateItemComponent],
  templateUrl: './duplicates-panel.component.html',
  styleUrl: './duplicates-panel.component.scss',
})
export class DuplicatesPanelComponent {
  protected readonly connectedDropLists: string[] = ['rows-drop-list'];
  @Input({ required: true }) public duplicates!: DuplicateRecord[];
  @Output() public readonly action = new EventEmitter<DuplicatesPanelAction>();

  protected onDropped(event: CdkDragDrop<DuplicateRecord[], FWBRecord[], FWBRecord>): void {
    if (event.item.data) {
      this.action.emit({ type: 'drop', record: event.item.data });
    }
  }

  protected onDuplicateItemAction(action: DuplicateItemAction): void {
    this.action.emit(action);
  }
}
