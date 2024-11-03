'use server';
import { reportService } from '@/server/services';
import { runDbQuery } from '@/server/services/db';

export const preload = () => {
  // void reportService.getReport(report_id);
}

export default async function getLoaderData() {
  const requests = (await runDbQuery<any[]>('generic.get', 'report.requests')).slice(-4);
  const { report_id } = requests[0] || { };

  return {
    requests,
    report: report_id ? await reportService.getReport(report_id) : null,
    report_id,
  };
}