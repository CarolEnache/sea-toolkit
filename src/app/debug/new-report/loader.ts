'use server';
import { reportService } from '@/server/services';
// import { formData } from '@/server/holistic-approach/hardcoded-mocks';
import { runDbQuery } from '@/server/services/db';

export const preload = () => {
  // void reportService.generateReport(formData);
}

export default async function getLoaderData() {
  return {
    requests: await runDbQuery('generic.get', 'report.requests'),
    report: await reportService.generateReport('a04d3364'),
  };
}