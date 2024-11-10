'use server';

import { reportService } from '@/server/services';

export async function getReportDataAction(id: string) {
  // If the report exists it will be created immediately, otherwise it will wait
  await reportService.setReport(id);
  return reportService.getReport(id);
}
