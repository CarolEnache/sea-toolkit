/**
 * ATOMIC GOAL: To produce the data needed for the report
 * The calculations can go in different files,
 * but in this document we deliver
 * the processed data ready to be assembled in the report
 * 
 * STATUS: Finished, though DataPoint interface may need to change.
 * See report-data-mock.json for contract with the data generation
 */

import { EconomicFactors, EconomicParameters, ForecastingGroup, ManufacturingStage, YearRangeString } from "./report.types";
import mockData from './report-data-mock.json'
import { type Region } from "../services";

const indexData = (data: DataPoint) => {
  const { Region, forecastGroup, economicFactor, manufacturingStage, period, economicParameter } = data;
  return [ Region, forecastGroup, economicFactor, manufacturingStage, period, economicParameter ].join(' | ');
}
const indexedData = (mockData as DataPoint[]).reduce((acc, data) => {
  const key = indexData(data);

  acc[key] = data;

  return acc;
}, {} as Record<string, DataPoint>)

type GenerateRegionalDataOptions = Region;

interface ReportDataOptions {
  forecastGroup: ForecastingGroup;
  economicFactor: EconomicFactors;
  manufacturingStage: ManufacturingStage;
  period: YearRangeString;
  economicParameter: EconomicParameters;
}
interface DataPoint extends ReportDataOptions, GenerateRegionalDataOptions {
  value?: number;
}

export class ReportData {
  options;

  constructor(options: GenerateRegionalDataOptions) {
    this.options = options;
  }

  public get(options: ReportDataOptions) {
    const query = { ...options, ...this.options };
    const dataPoint = indexedData[indexData(query)];
    return dataPoint?.value;
  }
}

export async function generateRegionalData(options: GenerateRegionalDataOptions) {
  return new ReportData(options);
}