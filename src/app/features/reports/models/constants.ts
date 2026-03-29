import { GetFWBReportsParams } from './interfaces';

export const DEFAULT_FILTERS: GetFWBReportsParams = {
  pageNumber: 1,
  pageSize: 10,
  sortOrder: '',
  sortName: '',
  from: '',
  until: '',
};

export const PARAM_KEYS = {
  pageNumber: 'pageNumber',
  pageSize: 'pageSize',
  sortOrder: 'sortOrder',
  sortName: 'SortName',
  from: 'from',
  until: 'until',
} as const;
