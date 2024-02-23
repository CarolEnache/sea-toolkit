export enum EconomicParameters {
  region = 'Region',
  employment = 'Employment',
  labourIncome = 'Labour Income',
  taxContribution = 'Tax Contribution',
  valueAddition = 'Value Addition',
}

export enum EconomicFactors {
  DirectEffect = "Direct Effect",
  // FirstRound = "First Round",
  // InternationalSupport = "International Support",
  UpstreamRequirements = "Upstream Requirements",
  IncomeEffect = "Income Effect",
  Total = "Total",
  Change = "Change",
}

export enum ManufacturingStage {
  Mining = "Mine Production",
  Refining = "Refined Production",
  FirstUse = "Direct Applications",
  EndUse = "End Manufactoring",
  Recycling = "Recycling",
  Total = "Total",
}

export enum ForecastingGroup {
  LOW = "LOW",
  BASE = "BASE",
  HIGH = "HIGH",
}

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
