'use server';
import { reportService } from '@/server/services';

import { redirect } from 'next/navigation';

export async function requestReport() {
  await reportService.requestReport();

  redirect('/be-docs/reportService');
}

export async function deleteReportRequest(formData: FormData) {
  const report_id = formData.get('report_id') as string;

  await reportService.deleteReport(report_id);

  redirect('/be-docs/reportService');
}
