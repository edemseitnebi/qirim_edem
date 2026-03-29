import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '@environments/environment';

import { FWBRecordListApi, FWBRecordList, GetFWBReportsParams } from '@app/features/reports/models/interfaces';
import { buildReportHttpParams, mapRecord } from '@app/features/reports/helpers/helpers';

@Injectable()
export class ReportsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost;

  getFWBReports(params: GetFWBReportsParams): Observable<FWBRecordList | null> {
    const httpParams = buildReportHttpParams(params);

    return this.http
      .get<FWBRecordListApi>(`${this.baseUrl}/api/Messages/FWBReports`, {
        params: httpParams,
      })
      .pipe(
        map((res) => ({
          fwbData: res.fwb_data.map(mapRecord),
          totalRecords: res.totalRecords,
        })),
        //все ошибки перехватываются интерсептором и дергают сервис notification
        catchError(() => of(null)),
      );
  }
}
