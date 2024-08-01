/**
 * ATOMIC GOAL: Format the data for FE consumption
 * The goal of this document is to produce the whole report response as expected in the FE.
 * 
 * STATUS: Almost finished, depends if report-data needs more info
 */

import type { FormData } from "./io.types";
import type { FactorsByStageReport, FactorsByStageReportBuilder, RegionalReport, Report } from "./report.types";
import type { ReportData } from './report-data';
import { EconomicParameters, ForecastingGroup, EconomicFactors, ManufacturingStage, YearRangeString } from "./report.types";
import { generateRegionalData } from './report-data';
import { FormulaComputer } from "./utils/FormulaComputer";
import { PromiseMap } from "./utils/PromiseMap";
import { oecdService } from "../services";

export const generateFactorsByStage = async (
  formData: FormData,
  regionalData: ReportData,
  economicParameter: EconomicParameters
): Promise<FactorsByStageReport> => {
  const factorsByStage: FactorsByStageReportBuilder = {};
  const rowTotalsComputer = new FormulaComputer<FactorsByStageReport>();
  const colTotalsComputer = new FormulaComputer<FactorsByStageReport>();

  for (const forecastGroup of Object.values(ForecastingGroup)) {
    factorsByStage[forecastGroup] = {};
    for (const economicFactor of Object.values(EconomicFactors)) {
      factorsByStage[forecastGroup]![economicFactor] = {};
      for (const manufacturingStage of Object.values(ManufacturingStage)) {
        factorsByStage[forecastGroup]![economicFactor]![manufacturingStage] = {};

        const past: YearRangeString = `${formData.source.industryMetric[0].startYear}-${formData.source.industryMetric[0].endYear}`;
        const future: YearRangeString = `${formData.source.manufacturing.startYear}-${formData.source.manufacturing.endYear}`;
        
        if (economicFactor === EconomicFactors.Change || economicFactor === EconomicFactors.Total) continue;

        colTotalsComputer.addFormula(`(table, { sum, each }) => {
          const factors = each(
            table['${forecastGroup}']
          ).filter(([factorName, factor]) => factorName !== '${EconomicFactors.Total}' && factorName !== '${EconomicFactors.Change}');

          table['${forecastGroup}']['${EconomicFactors.Total}']['${manufacturingStage}']['${past}'] = Math.round(sum(factors.map(([key, factor]) => factor['${manufacturingStage}']['${past}'])));
          table['${forecastGroup}']['${EconomicFactors.Total}']['${manufacturingStage}']['${future}'] = Math.round(sum(factors.map(([key, factor]) => factor['${manufacturingStage}']['${future}'])));

          table['${forecastGroup}']['${EconomicFactors.Change}']['${manufacturingStage}']['${past}'] = ''
          table['${forecastGroup}']['${EconomicFactors.Change}']['${manufacturingStage}']['${future}'] = Math.round(100 * table['${forecastGroup}']['${EconomicFactors.Total}']['${manufacturingStage}']['${future}'] / table['${forecastGroup}']['${EconomicFactors.Total}']['${manufacturingStage}']['${past}']) - 100 + '%';

          return table;
        }`);

        if (manufacturingStage === ManufacturingStage.Total) continue;

        rowTotalsComputer.addFormula(`(table, { sum, each }) => {
          const stages = each(
            table['${forecastGroup}']['${economicFactor}']
          ).filter(([stageName, stage]) => stageName !== '${ManufacturingStage.Total}');

          table['${forecastGroup}']['${economicFactor}']['${ManufacturingStage.Total}']['${past}'] = sum(stages.map(([key, stage]) => stage['${past}']));
          table['${forecastGroup}']['${economicFactor}']['${ManufacturingStage.Total}']['${future}'] = sum(stages.map(([key, stage]) => stage['${future}']));

          return table;
        }`);

        factorsByStage[forecastGroup]![economicFactor]![manufacturingStage]![
          past
        ] = regionalData.get({ forecastGroup, economicFactor, manufacturingStage, period: past, economicParameter });
        factorsByStage[forecastGroup]![economicFactor]![manufacturingStage]![
          future
        ] = regionalData.get({ forecastGroup, economicFactor, manufacturingStage, period: future, economicParameter });
      }
    }
  }

  return await colTotalsComputer.compute(
    await rowTotalsComputer.compute(factorsByStage as FactorsByStageReport)
  );
};

export const generateReport = async (formData: FormData): Promise<Report> => {
  const regions = await oecdService.getRegions(formData.source.industryMatrix[0].id);

  const getRegionalData = async (region: oecdService.Region) => {
    const regionalData = await generateRegionalData(region);

    const result = await PromiseMap<RegionalReport, EconomicParameters, string | FactorsByStageReport>({
      [EconomicParameters.region]: region.Region,
      [EconomicParameters.employment]: generateFactorsByStage(formData, regionalData, EconomicParameters.employment),
      [EconomicParameters.labourIncome]: generateFactorsByStage(formData, regionalData, EconomicParameters.labourIncome),
      [EconomicParameters.taxContribution]: generateFactorsByStage(formData, regionalData, EconomicParameters.taxContribution),
      [EconomicParameters.valueAddition]: generateFactorsByStage(formData, regionalData, EconomicParameters.valueAddition),
    });

    return result;
  };

  return await Promise.all(regions.map(getRegionalData));
};
