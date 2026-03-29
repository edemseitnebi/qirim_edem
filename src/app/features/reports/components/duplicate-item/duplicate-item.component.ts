import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { DuplicateRecord } from '@app/features/reports/models/interfaces';
import { DuplicateItemAction } from '@app/features/reports/models/types';

@Component({
  selector: 'app-duplicate-item',
  standalone: true,
  imports: [JsonPipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './duplicate-item.component.html',
  styleUrl: './duplicate-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateItemComponent {
  public readonly item = input.required<DuplicateRecord>();
  public readonly action = output<DuplicateItemAction>();

  protected toggleExpanded(): void {
    this.action.emit({ type: 'toggle', id: this.item().id });
  }

  protected removeItem(event: MouseEvent): void {
    event.stopPropagation();
    this.action.emit({ type: 'remove', id: this.item().id });
  }
}
