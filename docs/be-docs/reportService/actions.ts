'use server';
import { redirect } from 'next/navigation'

import { reportService } from '@/server/services'
import { runDbQuery } from '@/server/services/db';



export const requestReport = async () => {
  await reportService.requestReport();

  redirect('/be-docs/reportService');
  // return await footprintService.getAnalystIndustries();
}

export const deleteReportRequest = async (formData: FormData) => {
  const report_id = formData.get('report_id') as string;
  console.log('Deleting report', report_id);

  await runDbQuery('generic.del', 'report.requests', { where: { report_id } });

  redirect('/be-docs/reportService');
}
