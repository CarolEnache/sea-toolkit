/**
 * Util to handle report keys: id + license
 *
 * PROGRESS: COMPLETE
 */

import type { ReportKey } from './types';

export function generateReportKey(report_id: string, report_license: string): ReportKey {
  return `${report_id}_${report_license}`;
}

export function extractReportKey(key: ReportKey) {
  const [report_id, report_license] = key.split('_');

  return { report_id, report_license };
}
