import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '@environments/environment';

import {
  FWBRecordListApi,
  FWBRecordList,
  FWBRecord,
  FWBRecordApi,
  GetFWBReportsParams,
} from './type';

function mapRecord(api: FWBRecordApi): FWBRecord {
  return {
    fWB_Details: {
      ...api.fWB_Details,
      ModifiedTime: new Date(api.fWB_Details.ModifiedTime),
    },
    agent_Details: api.agent_Details,
    shipper_Details: api.shipper_Details,
    consignee_Details: api.consignee_Details,
  };
}

function buildReportHttpParams(params: GetFWBReportsParams): HttpParams {
  const requiredParams: [string, string][] = [
    ['pageNumber', String(params.pageNumber)],
    ['pageSize', String(params.pageSize)],
  ];

  const optionalParams: [string, string | undefined][] = [
    ['sortOrder', params.sortOrder],
    ['SortName', params.sortName],
    ['from', params.from],
    ['until', params.until],
  ];

  let httpParams = new HttpParams();

  for (const [key, value] of requiredParams) {
    httpParams = httpParams.set(key, value);
  }

  for (const [key, value] of optionalParams) {
    if (value) {
      httpParams = httpParams.set(key, value);
    }
  }

  return httpParams;
}

@Injectable({ providedIn: 'root' })
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
        catchError(() => of(null)),
      );
  }
}
