import { runDbQuery } from "../db";
import { generateReport as old_generateReport } from '../../holistic-approach/report-output';
import { formData as mockedFormData } from '../../holistic-approach/hardcoded-mocks';
import { type FormData } from '../../holistic-approach/io.types';

// Johan's Proposal
export type FormDataType = {
  region?: "Europe" | "North America" | "Global"; // ...and more | default: Global
  product?: "All products" | "Fine powder"; // ...and more | default: All products
  valueChainStage?: {
    mining?: boolean; // default: true
    refining?: boolean; // default: true
    firstUse?: boolean; // default: true
    endUse?: boolean; // default: true
    recycling?: boolean; // default: true
  };
  firstUseMode?:
  | "ISIC sectorial analysis"
  | "Representative Companies"
  | "Average"; // default: ISIC sectorial analysis
  contribution?: {
    input?: boolean; // default: true
    valueAdded?: boolean; // default: true
  };
  effect?: {
    directEffect?: boolean; // default: true
    firstRound?: boolean; // default: true
    industrialSupport?: boolean; // default: true
    incomeEffect?: boolean; // default: true
  };
};

const LAST_YEAR = 2022; // TODO: This should be the last year available in the data from the supplier

const generateReportId = () => {
  return crypto.randomUUID().slice(-8);
}

export async function generateReport(report_id: string) {
  const data = (await runDbQuery<FormDataType[]>('report.get_request', 'report.requests', { where: { report_id }}))[0];

  const formData: FormData = {
    ...mockedFormData,
    source: {
      ...mockedFormData.source,
      industryMatrix: [
        {
          id: 'oecd.wiebe_2008-2015',
        },
      ],
      industryMetric: [
        {
          id: 'unido.wiebe_2008-2015',
          startYear: 2010,
          endYear: LAST_YEAR - 1,
        },
      ],
    },
    config: {
      ...mockedFormData.config,
      region: data.region || 'Global',
    },
    // generated: {
    //   report: {
    //     compiler: "Socio-Economic Analysis Toolkit",
    //     id: crypto.randomUUID(),
    //   },
    // },
  };
  const report = await old_generateReport(formData);
  // console.log(report);
  return report;

  // return data.region === 'Global' ? report : (report.find(regionalReport => regionalReport['Region'] === data.region) || null);
}

export async function requestReport(insert: FormDataType = {}) {
  // This should be a hash of the query, so for the same query returns the same id
  const id = generateReportId();
  const license = 'dev-mvp';
  // Save query to DB & start report creation
  await runDbQuery(
    'report.add_request',
    'report.requests',
    {
      insert: {
        'region': insert.region || 'Global',
        'product': insert.product || 'All products',
        'mode': insert.firstUseMode || 'ISIC sectorial analysis',
        'value_endUse': insert.valueChainStage?.endUse || true,
        'value_firstUse': insert.valueChainStage?.firstUse || true,
        'value_mining': insert.valueChainStage?.mining || true,
        'value_recycling': insert.valueChainStage?.recycling || true,
        'value_refining': insert.valueChainStage?.refining || true,
        'contribution_input': insert.contribution?.input || true,
        'contribution_valueAdded': insert.contribution?.valueAdded || true,
        'effect_directEffect': insert.effect?.directEffect || true,
        'effect_firstRound': insert.effect?.firstRound || true,
        'effect_incomeEffect': insert.effect?.incomeEffect || true,
        'effect_industrialSupport': insert.effect?.industrialSupport || true,
        'report_id': id,
      }
    }
  );
  return [id, license].join('_');
}

export async function getReport(key: string) {
  const [id, license] = key.split('_');
  // Check if license is valid
  // runDbQuery()
  // Retrieve from result
  // runDbQuery()
}

export type Report = Awaited<ReturnType<typeof generateReport>>;
