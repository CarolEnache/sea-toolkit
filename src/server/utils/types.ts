import type Matrix from './mathjsMatrix';

export enum OECDRawTitles {
  VAR,
  Variable,
  COU,
  Country,
  Region,
  ROW,
  From,
  COL,
  To,
  TIME,
  Time,
  UnitCode,
  Unit,
  PowerCodeCode,
  PowerCode,
  ReferencePeriodCode,
  ReferencePeriod,
  Value,
}

export enum OECDRawVariables {
  DOMESTIC = 'DOMIMP', // Domestic output and imports
  TOTAL = 'TTL',
  VALUE_ADDED = 'VAL',
}

export enum OECDEmploymentTitles {
  VAR,
  Indicator,
  COU,
  Country,
  Region,
  PAR,
  Partner,
  IND,
  Industry,
  TIME,
  Time,
  UnitCode,
  Unit,
  PowerCodeCode,
  PowerCode,
  ReferencePeriodCode,
  ReferencePeriod,
  Value,
  FlagCodes,
  Flags,
}

export type MatrixIndex = number;
export type ColumnName = string;
export type RowName = string;

export type CellValue = string | number;
export type Row = CellValue[];
export type Table = Row[];

export type ArgValue = CellValue | ((previousValue: CellValue) => CellValue);

export type OECDVariableSheet = { [P in OECDRawVariables]?: Matrix };

export enum CoFirstUseTitles {
  'Region',
  'Year',
  'Adhesion (inc. rubber adhesion agent)',
  'Batteries',
  'Biotech – animal feed and fertiliser',
  'Biotech – biogas production',
  'Catalysts – used as catalyst precursor',
  'Catalysts – used as oxidation catalyst/for PTA and IPA',
  'Driers / paints',
  'Electronics',
  'Magnetic alloys',
  'Metallurgical alloys',
  'Pigments (inc. decolourising (glass))',
  'Surface treatment',
  'Carbide Diamond Tools',
  'Bespoke/Niche Applications',
  'Biotech - fermentation, biotech processes, health and medicine',
  'Other',
}
export enum CoFirstUseDistributionTitles {
  'Year',
  'CobaltProduct',
  'Adhesion (inc. rubber adhesion agent)',
  'Batteries',
  'Biotech – animal feed and fertiliser',
  'Biotech – biogas production',
  'Catalysts – used as catalyst precursor',
  'Catalysts – used as oxidation catalyst/for PTA and IPA',
  'Driers / paints',
  'Electronics',
  'Magnetic alloys',
  'Metallurgical alloys',
  'Pigments (inc. decolourising (glass))',
  'Surface treatment',
  'Carbide Diamond Tools',
  'Bespoke/Niche Applications',
  'Biotech - fermentation, biotech processes, health and medicine',
  'Other',
}
export enum CoEndUseTitles {
  'Application',
  'Region',
  'Year',
  'Portable electronics',
  'Power and motive',
  'Energy storage',
  'Automotive',
  'Other transport',
  'Mining and construction',
  'Agriculture',
  'Energy',
  'Aerospace',
  'Fabricated metal products',
  'Chemical',
  'Appliances',
  'Engines and turbines except transport',
  'Machinery and equipment',
  'Paints, inks and coatings',
  'Plastics',
  'Other',
}
export enum CoEndUseDistributionTitles {
  'Year',
  'Application',
  'CobaltProduct',
  'Portable electronics',
  'Power and motive',
  'Energy storage',
  'Automotive',
  'Other transport',
  'Mining and construction',
  'Agriculture',
  'Energy',
  'Aerospace',
  'Fabricated metal products',
  'Chemical',
  'Appliances',
  'Engines and turbines except transport',
  'Machinery and equipment',
  'Paints, inks and coatings',
  'Plastics',
  'Other',
}
export enum MSRRawDataTitles {
  Region,
  Year,
  Category,
  Product,
  NumOfCompanies,
  Production_inKiloTonnes,
  CoRelatedRevenue_inUSDMillionsPerTonne,
  TotalEmploymentAttributedToCobalt,
  EmploymentCostUSD_inMillions,
  RnDExpenditure_SustainingCapex_inUSDMillions,
  RnDExpenditure_ExpansionCapex_inUSDMillions,
  CoRelatedValueAdded_inUSDMillions,
  TotalAssetValue_inUSDMillions,
}

export type ForecastType = 'low' | 'base' | 'high';
