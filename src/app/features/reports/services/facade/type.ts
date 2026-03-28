import { FWBRecord } from '@app/features/reports/services/api/type';
import { GetFWBReportsParams } from '@app/features/reports/services/api/type';

export type ReportSortName =
  | 'prefix'
  | 'serial'
  | 'origin'
  | 'destination'
  | 'act_weight'
  | 'unit';

export type ReportSortOrder = 'asc' | 'desc' | '';

export interface DuplicateRecord {
  id: number;
  record: FWBRecord;
  expanded: boolean;
}

export interface ReportsDateRangeData {
  fromDate: Date | null;
  untilDate: Date | null;
}

export interface ReportRowData {
  item: FWBRecord;
  expanded: boolean;
}

export interface PaginatorData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
}

export type DuplicateItemAction =
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number };

export type DuplicatesPanelAction =
  | { type: 'drop'; record: FWBRecord }
  | DuplicateItemAction;

export const DEFAULT_FILTERS: GetFWBReportsParams = {
  pageNumber: 1,
  pageSize: 10,
  sortOrder: '',
  sortName: '',
  from: '',
  until: '',
};
