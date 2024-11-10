import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDbQuery } from '@/server/services/db';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function deleteReport(report_id: string) {
  await runDbQuery('generic.del', 'report.requests', { where: { report_id } });
  await rm(join(__dirname, '../../parquet/report', `${report_id}.parquet`));
}
