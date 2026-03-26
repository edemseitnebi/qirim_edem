import { Component, inject } from '@angular/core';

import type { GetFWBReportsParams } from '../../../api/rest/reports/type';
import { ReportsFacadeService } from './services/reports-facade.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  readonly facade = inject(ReportsFacadeService);
  readonly loading = this.facade.loading;
  readonly reportData = this.facade.reportData;

  updateFilters(partial: Partial<GetFWBReportsParams>): void {
    this.facade.applyFilters(partial);
  }
}
