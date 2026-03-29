import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { FWBRecord, DuplicateRecord } from '@app/features/reports/models/interfaces';
import { DuplicateItemAction, DuplicatesPanelAction } from '@app/features/reports/models/types';
import { DuplicateItemComponent } from '../duplicate-item/duplicate-item.component';

@Component({
  selector: 'app-duplicates-panel',
  standalone: true,
  imports: [DragDropModule, DuplicateItemComponent],
  templateUrl: './duplicates-panel.component.html',
  styleUrl: './duplicates-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicatesPanelComponent {
  protected readonly connectedDropLists: string[] = ['rows-drop-list'];

  public readonly duplicates = input.required<DuplicateRecord[]>();
  public readonly action = output<DuplicatesPanelAction>();

  protected onDropped(event: CdkDragDrop<DuplicateRecord[], FWBRecord[], FWBRecord>): void {
    if (event.item.data) {
      this.action.emit({ type: 'drop', record: event.item.data });
    }
  }

  protected onDuplicateItemAction(itemAction: DuplicateItemAction): void {
    this.action.emit(itemAction);
  }
}
