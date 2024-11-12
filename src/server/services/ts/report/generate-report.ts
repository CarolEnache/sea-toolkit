import type { ReportRequest, ReportValue } from './types';
import type { Context } from './utils';
import { runDbQuery } from '@/server/services/db';
import { getReportRequest } from './report-request';
import { assignToContext, calculate, generateVariations } from './utils'; // Adjust the import path as needed

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
  const context: Context = {};

  // Gather data
  const request = await getReportRequest(report_id);
  const regions: string[] = await getRegions(request.region);
  const periods: string[] = await getPeriods();

  // Define the calculations
  const calculations = [
    {
      id: 'D117',
      sheet: 'Model',
      formula: async (ctx: Context) => {
        const D34 = ctx.Model.D34;
        const D32 = ctx.Model.D32;
        const D20 = ctx.Model.D20;
        return D34 * D32 * D20 / 1_000_000;
      },
    },
    {
      id: 'D118',
      sheet: 'Model',
      formula: async (ctx: Context) => {
        const D32 = ctx.Model.D32;
        const D57 = ctx.Model.D57;
        return D32 * D57;
      },
    },
    {
      id: 'D119',
      sheet: 'Model',
      formula: async (ctx: Context) => {
        const D32 = ctx.Model.D32;
        const D58 = ctx.Model.D58;
        return D32 * D58;
      },
    },
    {
      id: 'D120',
      sheet: 'Model',
      formula: async (ctx: Context) => {
        const D32 = ctx.Model.D32;
        const D59 = ctx.Model.D59;
        return D32 * D59;
      },
    },
    {
      id: 'D20',
      sheet: 'Model',
      formula: async (ctx: Context) => {
        const FirstUseMode = ctx.Model.FirstUseMode;
        const D11 = ctx.Footprint.JT20;
        const D15 = ctx.Footprint.JT8; // Simplified, should match industry B
        if (FirstUseMode === 'ISIC sectoral analysis') {
          return D11;
        }
        else if (FirstUseMode === 'Representative companies') {
          return D15;
        }
        else {
          return (D11 + D15) / 2;
        }
      },
    },
    // Add more calculation units as needed
  ];

  // Perform calculations
  await calculate(calculations, context);

  for (const region of regions) {
    for (const economic_factor of economicFactors) {
      for (const manufacturing_stage of manufacturingStages) {
        const [past, future] = periods;

        // Use calculated values from the context
        const baseData = {
          region,
          economic_factor,
          forecast_group: 'BASE',
          manufacturing_stage,
          period: past,
        };

        // Generate variations for economic parameters with corresponding values using async callback
        const variations = await generateVariations(baseData, 'economic_parameter', economicParameters, async () => context.Model.D117); // Example usage, adjust as needed

        // Add variations to report data
        reportData.push(...variations);

        for (const forecast_group of forecastGroups) {
          const futureData = {
            region,
            economic_factor,
            forecast_group,
            manufacturing_stage,
            period: future,
          };

          // Generate variations for economic parameters with corresponding values using async callback
          const futureVariations = await generateVariations(futureData, 'economic_parameter', economicParameters, async () => Math.random() * 100); // Replace with actual calculated value if needed

          // Add variations to report data
          reportData.push(...futureVariations);
        }
      }
    }
  }

  return reportData;
}
