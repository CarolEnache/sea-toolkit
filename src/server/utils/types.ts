import Matrix from "./mathjsMatrix";

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
  DOMESTIC = "DOMIMP", // Domestic output and imports
  TOTAL = "TTL",
  VALUE_ADDED = "VAL",
}

export type MatrixIndex = number;
export type ColumnName = string;
export type RowName = string;

export type CellValue = string | number;
export type Row = CellValue[];
export type Table = Row[];

export type ArgValue = CellValue | ((previousValue: CellValue) => CellValue);

export type OECDVariableSheet = { [P in OECDRawVariables]?: Matrix };
