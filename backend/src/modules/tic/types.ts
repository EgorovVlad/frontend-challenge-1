import { BillingCodeType, BillingClass, PlanMarketType, TinType, ServiceCode } from '@/modules/tic/constants';

export interface InternalTiCData {
  groupName: string;
  providerName: string;
  plan: string;
  planId: string;
  placeOfService: string;
  claimType: BillingClass;
  procedureCode: string;
  providerId: string;
  allowed: number;
  billed: number;
}

export interface TiCFile {
  id: string;
  url: string;
  data: TiC;
}

export interface TiC {
  reporting_entity_name: string;
  reporting_entity_type: PlanMarketType;
  plan_name: string;
  plan_id_type: string;
  plan_id: string;
  plan_market_type: PlanMarketType;
  last_updated_on: string;
  version: string;
  out_of_network: OutOfNetwork[];
}

export interface OutOfNetwork {
  name: string;
  billing_code_type: BillingCodeType;
  billing_code_type_version: string;
  billing_code: string;
  description: string;
  allowed_amounts: AllowedAmount[];
}

export interface AllowedAmount {
  tin: Tin;
  service_code: ServiceCode[];
  billing_class: BillingClass;
  payments: Payment[];
}

export interface Tin {
  type: TinType;
  value: string;
}

export interface Payment {
  allowed_amount: number;
  billing_code_modifier: string[];
  providers: Provider[];
}

export interface Provider {
  billed_charge: number;
  npi: number[];
}
