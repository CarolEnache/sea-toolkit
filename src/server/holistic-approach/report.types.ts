export enum EconomicParameters {
  region = 'Region',
  employment = 'Employment',
  labourIncome = 'Labour Income',
  taxContribution = 'Tax Contribution',
  valueAddition = 'Value Addition',
}

export type EconomicParametersKeysWithoutRegion = Exclude<
  keyof typeof EconomicParameters,
  "region"
>;
export type EconomicParameterValuesEnum =
  (typeof EconomicParameters)[EconomicParametersKeysWithoutRegion];



export enum EconomicFactors {
  DirectEffect = "Direct Effect",
  UpstreamRequirements = "Upstream Requirements",
  IncomeEffect = "Income Effect",
  Total = "Total",
  Change = "Change",
   // FirstRound = "First Round",
  // InternationalSupport = "International Support",
}


export type EconomicFactorsKeys = keyof typeof EconomicFactors;
export type EconomicFactorsValuesEnum = (typeof EconomicFactors)[EconomicFactorsKeys];

export enum ManufacturingStage {
  Mining = "Mine Production",
  Refining = "Refined Production",
  FirstUse = "Direct Applications",
  EndUse = "End Manufactoring",
  Recycling = "Recycling",
  Total = "Total",
}
export type ManufacturingKeys = keyof typeof ManufacturingStage;
export type ManufacturingValuesEnum = (typeof ManufacturingStage)[ManufacturingKeys];

export enum ForecastingGroup {
  LOW = "LOW",
  BASE = "BASE",
  HIGH = "HIGH",
}

export type ForecastingGroupKey = keyof typeof ForecastingGroup;

export type YearRangeString = `${string}-${string}`;
// Properties exist
export type FactorsByStageReport = Record<
  ForecastingGroup,
  Record<
    EconomicFactors,
    Record<ManufacturingStage, Record<YearRangeString, number>>
  >
>;
// Properties are optional while building
export type FactorsByStageReportBuilder = {
  [A in ForecastingGroup]?: {
    [B in EconomicFactors]?: {
      [C in ManufacturingStage]?: {
        [D in YearRangeString]?: number;
      };
    };
  };
};

export interface RegionalReport {
  [EconomicParameters.region]: string;
  [EconomicParameters.employment]: FactorsByStageReport;
  [EconomicParameters.labourIncome]: FactorsByStageReport;
  [EconomicParameters.taxContribution]: FactorsByStageReport;
  [EconomicParameters.valueAddition]: FactorsByStageReport;
}
export type Report = RegionalReport[];
