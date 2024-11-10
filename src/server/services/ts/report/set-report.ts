/**
 * This file orchestrates generating the report from a request
 * and saving the results to the database
 *
 * PROGRESS: COMPLETE
 */

import type { ReportKey, ReportValue } from './types';
import { createDbTable, runDbQuery } from '@/server/services/db';
import { generateReport } from './generate-report';
import reportMock from './report-data-mock.json';
import { hasFlag } from './report-flags';
import { getReportRequest, updateReportRequestStatus } from './report-request';

// #region UTILS
async function getReportStatus(report_id: string) {
  const { report_status } = await getReportRequest(report_id);
  return report_status;
}

async function createReportTable(report_id: string) {
  await createDbTable(`report/${report_id}`, {
    forecast_group: 'VARCHAR',
    economic_factor: 'VARCHAR',
    manufacturing_stage: 'VARCHAR',
    period: 'VARCHAR',
    economic_parameter: 'VARCHAR',
    region: 'VARCHAR',
    value: 'INT',
  });
}

async function saveReport(report_id: string, reportData: ReportValue[]) {
  for await (const insert of reportData) {
    await runDbQuery('report_add_result', `report/${report_id}`, { insert });
  }
}

async function waitUntilMeets(test: () => Promise<boolean>) {
  let status: boolean = false;
  while (!status) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    status = await test();
  }
}
// #endregion

export async function setReport(key: ReportKey) {
  const [report_id] = key.split('_');
  const report_status = await getReportStatus(report_id);

  if (report_status === 'pending') {
    await updateReportRequestStatus(report_id, 'processing');

    try {
      let reportData = reportMock;

      if (hasFlag('generate_report')) {
        reportData = await generateReport(report_id);
      }

      await createReportTable(report_id);

      await saveReport(report_id, reportData);

      await updateReportRequestStatus(report_id, 'complete');
    }
    catch {
      await updateReportRequestStatus(report_id, 'error');
    }
  }
  else if (report_status === 'processing') {
    await waitUntilMeets(async () => await getReportStatus(report_id) !== 'processing');
  }
}
