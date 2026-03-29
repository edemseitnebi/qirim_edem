import { HttpParams } from '@angular/common/http';

import {
  FWBRecord,
  FWBRecordApi,
  GetFWBReportsParams,
} from '@app/features/reports/models/interfaces';

export function mapRecord(api: FWBRecordApi): FWBRecord {
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

export function buildReportHttpParams(params: GetFWBReportsParams): HttpParams {
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
