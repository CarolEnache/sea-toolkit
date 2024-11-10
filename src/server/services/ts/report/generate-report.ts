import type { ReportRequest, ReportValue } from './types';
import { runDbQuery } from '@/server/services/db';
import { getReportRequest } from './report-request';

async function getRegions(regionField: ReportRequest['region']) {
  // TODO: How do we get more than 1 region?
  return [regionField];
}

// TODO: Couldn't find a way of getting these from the data
const economicFactors = ['Direct effect', 'First-round requirements', 'Industrial support', 'Income effect'];
const economicParameters = ['Employment', 'Labour Income', 'Tax Contribution', 'Value Addition'];
const forecastGroups = ['LOW', 'BASE', 'HIGH'];
const manufacturingStages = ['Mine Production of cobalt', 'Refined Production of cobalt', 'Direct applications', 'End manufacturing', 'Recycling'];
async function getPeriods() {
  const { yearStart, yearEnd } = (await runDbQuery<[{ yearStart: string; yearEnd: string }]>('msr_get_year_range', 'msr.cobalt-insitute_2019'))[0];
  // TODO: This should come from the data
  const LAST_YEAR = 2022;

  return [`${yearStart}-${LAST_YEAR}`, `${LAST_YEAR}-${yearEnd}`];
}

export async function generateReport(report_id: string) {
  const reportData: ReportValue[] = [];

  // Gather data
  const request = await getReportRequest(report_id);
  const regions: string[] = await getRegions(request.region);
  const periods: string[] = await getPeriods();

  for (const region of regions) {
    for (const economic_factor of economicFactors) {
      for (const economic_parameter of economicParameters) {
        for (const manufacturing_stage of manufacturingStages) {
          const [past, future] = periods;

          reportData.push({
            region,
            economic_factor,
            economic_parameter,
            forecast_group: 'BASE',
            manufacturing_stage,
            period: past,
            value: Math.random() * 100,
          });

          for (const forecast_group of forecastGroups) {
            reportData.push({
              region,
              economic_factor,
              economic_parameter,
              forecast_group,
              manufacturing_stage,
              period: future,
              value: Math.random() * 100,
            });
          }
        }
      }
    }
  }

  return reportData;
}
