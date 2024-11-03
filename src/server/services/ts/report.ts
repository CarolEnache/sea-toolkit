import { createDbTable, runDbQuery, runDynamicDbQuery } from "../db";
import reportMock from '../../holistic-approach/report-data-mock.json';
import { FormDataType } from "@/types/front/report";
import { type ReportStatus } from "../types";

const LAST_YEAR = 2022; // TODO: This should be the last year available in the data from the supplier

const generateReportId = () => {
  return crypto.randomUUID().slice(-8);
}

export async function requestReport(insert: FormDataType = {}) {
  // This should be a hash of the query, so for the same query returns the same id
  const id = generateReportId();
  const license = 'dev-mvp';
  // Save query to DB & start report creation
  await runDbQuery(
    'report.add_request',
    'report.requests',
    {
      insert: {
        'region': insert.region || 'Global',
        'product': insert.product || 'All products',
        'mode': insert.firstUseMode || 'ISIC sectorial analysis',
        'value_endUse': insert.valueChainStage?.endUse || true,
        'value_firstUse': insert.valueChainStage?.firstUse || true,
        'value_mining': insert.valueChainStage?.mining || true,
        'value_recycling': insert.valueChainStage?.recycling || true,
        'value_refining': insert.valueChainStage?.refining || true,
        'contribution_input': insert.contribution?.input || true,
        'contribution_valueAdded': insert.contribution?.valueAdded || true,
        'effect_directEffect': insert.effect?.directEffect || true,
        'effect_firstRound': insert.effect?.firstRound || true,
        'effect_incomeEffect': insert.effect?.incomeEffect || true,
        'effect_industrialSupport': insert.effect?.industrialSupport || true,
        'report_id': id,
        'report_license': license,
        'report_status': 'pending',
      }
    }
  );
  return [id, license].join('_');
}

const updateStatus = (report_id: string, status: string) => runDbQuery(
  'generic_mod',
  'report.requests',
  {
    update: { report_status: status },
    where: { report_id },
  }
)

export async function setReport(key: string) {
  const [report_id, license] = key.split('_');
  const { report_status } = (await runDbQuery<[{ report_status: ReportStatus }]>('report.get_request', 'report.requests', { where: { report_id }}))[0];

  if (report_status === 'pending') {
    await updateStatus(report_id, 'processing');

    await createDbTable(`report/${report_id}`, {
      forecast_group: 'VARCHAR',
      economic_factor: 'VARCHAR',
      manufacturing_stage: 'VARCHAR',
      period: 'VARCHAR',
      economic_parameter: 'VARCHAR',
      region: 'VARCHAR',
      value: 'INT',
    });

    // TODO: Replace with real generation
    for (const each of reportMock) {
      await runDbQuery('report_add_result', `report/${report_id}`, {
        insert: {
          region: each.Region,
          economic_factor: each.economicFactor,
          economic_parameter: each.economicParameter,
          forecast_group: each.forecastGroup,
          manufacturing_stage: each.manufacturingStage,
          period: each.period,
          value: each.value,
        }
      })
    }
    
    await updateStatus(report_id, 'complete');
  } else if (report_status === 'processing') {
    let transition_status: ReportStatus = report_status;
    while (transition_status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      transition_status = (await runDbQuery<[{ report_status: ReportStatus }]>('report.get_request', 'report.requests', { where: { report_id }}))[0].report_status;
    }
  }
}

export async function getReport(key: string) {
  const [report_id, report_license] = key.split('_');
  const reportRequest = (await runDbQuery<any[]>('report.get_request', 'report.requests', { where: { report_id }}))[0];

  // if (reportRequest.report_license !== report_license) {
  //   return { error: 'REPORT:001' };
  // } else
  // if (isLicenseExpired(reportRequest.report_license)) {
  //   return { error: 'REPORT:002' };
  // } else
  // if (reportRequest.report_status === 'pending') {
  //   return { error: 'REPORT:003' };
  // } else
  if (reportRequest.report_status === 'error') {
    return { error: 'REPORT:004' };
  }

  try {
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

    const [{ pivot_columns }] = await runDynamicDbQuery<[{ pivot_columns: string }]>(`SELECT STRING_AGG('SUM(CASE WHEN manufacturing_stage = ''' || manufacturing_stage || ''' AND period = ''' || period || ''' THEN value ELSE 0 END) AS "' || manufacturing_stage || '_' || period || '"', ', ') AS pivot_columns FROM (SELECT DISTINCT manufacturing_stage, period FROM PARQUET_TABLE) AS subquery;`, `report/${report_id}`);
    const [{ period_total_columns }] = await runDynamicDbQuery<[{ period_total_columns: string }]>(`SELECT STRING_AGG('SUM(CASE WHEN period = ''' || period || ''' THEN value ELSE 0 END) AS "Total_' || period || '"', ', ') AS period_total_columns FROM (SELECT DISTINCT period FROM PARQUET_TABLE) AS subquery;`, `report/${report_id}`);

    const dataResult = await runDynamicDbQuery<any[]>(`
      SELECT 
          COALESCE(region, 'Total') AS region,
          COALESCE(economic_parameter, 'Total') AS economic_parameter,
          COALESCE(forecast_group, 'Total') AS forecast_group,
          COALESCE(economic_factor, 'Total') AS economic_factor,

          -- Insert the dynamic pivot columns
          ${pivot_columns},

          -- Insert the dynamic period totals
          ${period_total_columns},

          -- Overall row total
          SUM(value) AS "Row_Total"
          
      FROM PARQUET_TABLE
      GROUP BY ROLLUP(region, economic_parameter, forecast_group, economic_factor)
      ORDER BY 
          region,
          economic_parameter,
          forecast_group,
          economic_factor;
    `, `report/${report_id}`);

    const reports: any[] = [];
    const regionMap: any = {};

    dataResult.forEach(row => {
        const { region, economic_parameter, forecast_group, economic_factor, Row_Total, ...pivotValues } = row;

        if (region === 'Total') return;
    
        // If this region hasn't been encountered before, initialize its structure
        if (!regionMap[region]) {
            regionMap[region] = { region };
            reports.push(regionMap[region]);
        }
    
        // Access the nested structure for this region's data
        const regionData = regionMap[region];
    
        // Initialize the nested structure within the region
        if (!regionData[economic_parameter]) regionData[economic_parameter] = {};
        if (!regionData[economic_parameter][forecast_group]) regionData[economic_parameter][forecast_group] = {};
        if (!regionData[economic_parameter][forecast_group][economic_factor]) regionData[economic_parameter][forecast_group][economic_factor] = {};
    
        // Populate each manufacturing_stage_period combination
        Object.keys(pivotValues).forEach(key => {
            const [manufacturingStage, period] = key.split('_');
    
            // Initialize structure for each manufacturing stage and period within the economic_factor
            if (!regionData[economic_parameter][forecast_group][economic_factor][manufacturingStage]) {
                regionData[economic_parameter][forecast_group][economic_factor][manufacturingStage] = {};
            }
    
            // Assign value for each period within the manufacturing stage
            regionData[economic_parameter][forecast_group][economic_factor][manufacturingStage][period] = Number(pivotValues[key]);
        });
    });

    return {
      meta,
      reports,
    };
  } catch(e) {
    return { error: 'REPORT:005' };
  }
}

export type Report = Awaited<ReturnType<typeof getReport>>;
