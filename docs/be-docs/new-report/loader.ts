'use server';
import { reportService } from '@/server/services';
// import { formData } from '@/server/holistic-approach/hardcoded-mocks';
import { runDbQuery } from '@/server/services/db';

export const preload = () => {
  // void reportService.generateReport(formData);
}

export default async function getLoaderData() {
  const requests = (await runDbQuery<any[]>('generic.get', 'report.requests')).slice(-4);
  const { report_id } = requests[0];

  return {
    requests,
    report: await reportService.generateReport(report_id),
    report_id,
  };
}