import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import type {
  FWBRecordListApi,
  FWBRecordList,
  FWBRecord,
  FWBRecordApi,
  GetFWBReportsParams,
} from './type';

const API_BASE_URL = 'https://enxtlinux.enxt.solutions:8013';
const ENDPOINT = '/api/Messages/FWBReports';

export const EMPTY_FWB_LIST: FWBRecordList = { fwbData: [], totalRecords: 0 };

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

@Injectable({ providedIn: 'root' })
export class ReportsRestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  getFWBReports(params: GetFWBReportsParams): Observable<FWBRecordList | null> {
    const httpParams = new HttpParams({
      fromObject: {
        pageNumber: String(params.pageNumber),
        pageSize: String(params.pageSize),
        sortOrder: params.sortOrder ?? '',
        sortName: params.sortName ?? '',
        from: params.from ?? '',
        until: params.until ?? '',
      },
    });

    return this.http
      .get<FWBRecordListApi>(`${this.baseUrl}${ENDPOINT}`, {
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
