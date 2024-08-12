'use server';
import { redirect } from 'next/navigation'

import { reportService } from '@/server/services'
import { runDbQuery } from '@/server/services/db';



export const requestReport = async () => {
  await reportService.requestReport();

  redirect('/debug/new-report');
  // return await footprintService.getAnalystIndustries();
}

export const deleteReportRequest = async (formData: FormData) => {
  const report_id = formData.get('report_id') as string;

  await runDbQuery('generic.del', 'report.requests', { where: { report_id } });

  redirect('/debug/new-report');
}
