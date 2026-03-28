export interface GetFWBReportsParams {
  pageNumber: number;
  pageSize: number;
  sortOrder?: string;
  sortName?: string;
  from?: string;
  until?: string;
}

export interface FWBRecordListApi {
  fwb_data: FWBRecordApi[];
  totalRecords: number;
}

export interface FWBRecordApi {
  fWB_Details: FWBDetailsApi;
  agent_Details: AgentDetailsApi | null;
  shipper_Details: ShipperDetailsApi;
  consignee_Details: ConsigneeDetailsApi;
}

export interface FWBDetailsApi {
  Sequence: number;
  AWBID: number;
  AWB_Prefix: string;
  AWB_Serial: string;
  AWB_Origin: string;
  AWB_Destination: string;
  Pieces: number;
  Weight_Actual: number;
  Weight_Identifier: string;
  Volume: number | null;
  Volume_Identifier: string | null;
  Goods_Description: string;
  AgentDetailsId: number | null;
  ShipperId: number;
  ConsigneeId: number;
  ModifiedTime: string;
}

export type AgentDetailsApi = Record<string, string | number | null>;

export interface ShipperDetailsApi {
  Sequence: number;
  Account_Number: number | null;
  Names: string;
  Addresses: string;
  Place: string;
  State: string | null;
  Country_Code: string;
  Post_Code: string;
}

export interface ConsigneeDetailsApi {
  Sequence: number;
  Account_Number: number | null;
  Names: string;
  Addresses: string;
  Place: string;
  State: string | null;
  Country_Code: string;
  Post_Code: string;
}

export interface FWBRecordList {
  fwbData: FWBRecord[];
  totalRecords: number;
}

export interface FWBRecord {
  fWB_Details: FWBDetails;
  agent_Details: AgentDetailsApi | null;
  shipper_Details: ShipperDetailsApi;
  consignee_Details: ConsigneeDetailsApi;
}

export interface FWBDetails {
  Sequence: number;
  AWBID: number;
  AWB_Prefix: string;
  AWB_Serial: string;
  AWB_Origin: string;
  AWB_Destination: string;
  Pieces: number;
  Weight_Actual: number;
  Weight_Identifier: string;
  Volume: number | null;
  Volume_Identifier: string | null;
  Goods_Description: string;
  AgentDetailsId: number | null;
  ShipperId: number;
  ConsigneeId: number;
  ModifiedTime: Date;
}
