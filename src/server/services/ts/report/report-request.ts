/**
 * This allows to request a report
 * It saves the query to the DB
 * retrieves it or updates it
 *
 * PROGRESS: COMPLETE
 */

import type { FormDataType } from '@/types/front/report';
import type { ReportRequest } from './types';
import { runDbQuery } from '@/server/services/db';
import { isLicenseValid } from '../license';
import { hasFlag } from './report-flags';
import { generateReportId } from './report-id';
import { generateReportKey } from './report-key';
import { setReport } from './set-report';

export async function getReportRequest(report_id: string) {
  const requests = await runDbQuery<ReportRequest[]>('report.get_request', 'report.requests', { where: { report_id } });
  return requests[0];
}

export function updateReportRequestStatus(report_id: string, status: string) {
  return runDbQuery(
    'generic_mod',
    'report.requests',
    {
      update: { report_status: status },
      where: { report_id },
    },
  );
}

export async function requestReport(request: FormDataType = {}) {
  // Add defaults to user request
  const insert = {
    region: request.region || 'Global',
    product: request.product || 'All products',
    mode: request.firstUseMode || 'ISIC sectorial analysis',
    value_endUse: request.valueChainStage?.endUse || true,
    value_firstUse: request.valueChainStage?.firstUse || true,
    value_mining: request.valueChainStage?.mining || true,
    value_recycling: request.valueChainStage?.recycling || true,
    value_refining: request.valueChainStage?.refining || true,
    contribution_input: request.contribution?.input || true,
    contribution_valueAdded: request.contribution?.valueAdded || true,
    effect_directEffect: request.effect?.directEffect || true,
    effect_firstRound: request.effect?.firstRound || true,
    effect_incomeEffect: request.effect?.incomeEffect || true,
    effect_industrialSupport: request.effect?.industrialSupport || true,
  };
  // Hash uniquely the request
  const report_id = generateReportId(JSON.stringify(insert));
  // Validate licese
  if (hasFlag('enforce_license')) {
    if (!isLicenseValid(request.license)) {
      return { error: 'REPORT_REQUEST:001' };
    }
  }
  // TODO: Get the license from the request, remove undefined path
  const report_license = request.license ?? 'dev-mvp';
  // Save request to DB
  await runDbQuery(
    'report.add_request',
    'report.requests',
    {
      insert: {
        ...insert,
        report_id,
        report_license,
        report_status: 'pending',
      },
    },
  );
  // Create the report key
  const report_key = generateReportKey(report_id, report_license);
  // Fire & Forget: Start report creation, but do not await for it
  setReport(report_key);

  return report_key;
}
