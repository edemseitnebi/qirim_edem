import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { DuplicateItemAction, DuplicateRecord } from '@app/features/reports/services/facade/type';

@Component({
  selector: 'app-duplicate-item',
  standalone: true,
  imports: [JsonPipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './duplicate-item.component.html',
  styleUrl: './duplicate-item.component.scss',
})
export class DuplicateItemComponent {
  @Input({ required: true }) public item!: DuplicateRecord;
  @Output() public readonly action = new EventEmitter<DuplicateItemAction>();

  protected toggleExpanded(): void {
    this.action.emit({ type: 'toggle', id: this.item.id });
  }

  protected removeItem(event: MouseEvent): void {
    event.stopPropagation();
    this.action.emit({ type: 'remove', id: this.item.id });
  }
}
