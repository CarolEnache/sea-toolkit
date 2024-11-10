/**
 * This function allows to retrieve the report once generated
 * It includes the calculation of some totals in SQL
 * and then building the nested structure for the FE
 *
 * PROGRESS: COMPLETE
 */

import type { ReportKey } from './types';
import { runDynamicDbQuery } from '@/server/services/db';
import { isLicenseValid } from '../license';
import { hasFlag } from './report-flags';
import { extractReportKey } from './report-key';
import { getReportRequest } from './report-request';

export async function getReport(key: ReportKey) {
  const { report_id, report_license } = extractReportKey(key);
  // Retrieve the request
  const reportRequest = await getReportRequest(report_id);

  // Check the license
  if (hasFlag('enforce_license')) {
    if (reportRequest.report_license !== report_license) {
      return { error: 'REPORT:001' };
    }
    else if (await isLicenseValid(reportRequest.report_license)) {
      return { error: 'REPORT:002' };
    }
  }

  // Check if the report is completed
  if (reportRequest.report_status !== 'complete') {
    return { error: 'REPORT:003' };
  }

  try {
    // Builds the meta section
    const [meta] = await runDynamicDbQuery<any[]>(`
      SELECT 
        ARRAY_AGG(DISTINCT region) AS regions,
        ARRAY_AGG(DISTINCT economic_parameter) AS economic_parameters,
        ARRAY_AGG(DISTINCT forecast_group) AS forecast_groups,
        ARRAY_AGG(DISTINCT economic_factor) AS economic_factors,
        ARRAY_AGG(DISTINCT manufacturing_stage) AS manufacturing_stages,
        ARRAY_AGG(DISTINCT period) AS periods
      FROM PARQUET_TABLE
    `, `report/${report_id}`);

    // Builds the manufacturing_stage columns for the pivot table
    const [{ manufacturing_pivot_columns }] = await runDynamicDbQuery<[{ manufacturing_pivot_columns: string }]>(`SELECT STRING_AGG('SUM(CASE WHEN manufacturing_stage = ''' || manufacturing_stage || ''' AND period = ''' || period || ''' THEN value ELSE 0 END) AS "' || manufacturing_stage || '_' || period || '"', ', ') AS manufacturing_pivot_columns FROM (SELECT DISTINCT manufacturing_stage, period FROM PARQUET_TABLE) AS subquery;`, `report/${report_id}`);
    // Builds the period columns for the pivot table
    const [{ period_pivot_columns }] = await runDynamicDbQuery<[{ period_pivot_columns: string }]>(`SELECT STRING_AGG('SUM(CASE WHEN period = ''' || period || ''' THEN value ELSE 0 END) AS "Total_' || period || '"', ', ') AS period_pivot_columns FROM (SELECT DISTINCT period FROM PARQUET_TABLE) AS subquery;`, `report/${report_id}`);

    // Calculate the pivot table with totals
    const dataResult = await runDynamicDbQuery<any[]>(`
      SELECT 
          COALESCE(region, 'Total') AS region,
          COALESCE(economic_parameter, 'Total') AS economic_parameter,
          COALESCE(forecast_group, 'Total') AS forecast_group,
          COALESCE(economic_factor, 'Total') AS economic_factor,
          ${manufacturing_pivot_columns},
          ${period_pivot_columns},
          SUM(value) AS "Row_Total"
      FROM PARQUET_TABLE
      GROUP BY ROLLUP(region, economic_parameter, forecast_group, economic_factor)
      ORDER BY 
          region,
          economic_parameter,
          forecast_group,
          economic_factor;
    `, `report/${report_id}`);

    // Re-map into the nested FE structure
    const reports: any[] = [];
    const regionMap: any = {};

    dataResult.forEach((row) => {
      const { region, economic_parameter, forecast_group, economic_factor, Row_Total, ...pivotValues } = row;

      if (region === 'Total')
        return;

      // If this region hasn't been encountered before, initialize its structure
      if (!regionMap[region]) {
        regionMap[region] = { region };
        reports.push(regionMap[region]);
      }

      // Access the nested structure for this region's data
      const regionData = regionMap[region];

      // Initialize the nested structure within the region
      if (!regionData[economic_parameter])
        regionData[economic_parameter] = {};
      if (!regionData[economic_parameter][forecast_group])
        regionData[economic_parameter][forecast_group] = {};
      if (!regionData[economic_parameter][forecast_group][economic_factor])
        regionData[economic_parameter][forecast_group][economic_factor] = {};

      // Populate each manufacturing_stage_period combination
      Object.keys(pivotValues).forEach((key) => {
        const [manufacturingStage, period] = key.split('_');

        // Initialize structure for each manufacturing stage and period within the economic_factor
        if (!regionData[economic_parameter][forecast_group][economic_factor][manufacturingStage]) {
          regionData[economic_parameter][forecast_group][economic_factor][manufacturingStage] = {};
        }

        // Assign value for each period within the manufacturing stage
        if (pivotValues[key]) {
          regionData[economic_parameter][forecast_group][economic_factor][manufacturingStage][period] = Number(pivotValues[key]);
        }
      });
    });

    return {
      meta,
      reports,
    };
  }
  catch {
    return { error: 'REPORT:004' };
  }
}

export type Report = Awaited<ReturnType<typeof getReport>>;
