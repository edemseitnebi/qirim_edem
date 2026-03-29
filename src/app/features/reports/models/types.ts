import { FWBRecord } from './interfaces';

export type ReportSortName =
  | 'prefix'
  | 'serial'
  | 'origin'
  | 'destination'
  | 'act_weight'
  | 'unit';

export type ReportSortOrder = 'asc' | 'desc' | '';

export type DuplicateItemAction =
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number };

export type DuplicatesPanelAction =
  | { type: 'drop'; record: FWBRecord }
  | DuplicateItemAction;
