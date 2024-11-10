export type ReportKey = `${string}_${string}`;
export type ReportStatus = 'pending' | 'processing' | 'complete';

export type ReportValue = {
  region: string;
  economic_factor: string;
  economic_parameter: string;
  forecast_group: string;
  manufacturing_stage: string;
  period: string;
  value: number;
};

export type ReportRequest = {
  region: string; // TODO: To be specific
  product: string; // TODO: To be specific
  mode: string; // TODO: To be specific
  value_endUse: boolean;
  value_firstUse: boolean;
  value_mining: boolean;
  value_recycling: boolean;
  value_refining: boolean;
  contribution_input: boolean;
  contribution_valueAdded: boolean;
  effect_directEffect: boolean;
  effect_firstRound: boolean;
  effect_incomeEffect: boolean;
  effect_industrialSupport: boolean;
  report_id: string;
  report_license: string;
  report_status: ReportStatus;
  // Amazon Q dreamt of these ones:
  // report_date: string,
  // report_version: string,
  // report_org: string,
  // report_copy: string,
  // report_authors: string,
  // report_compiler: string,
};
