import { runDbQuery } from "../approach/data-to-report/data/parquet/db";
import { Industry } from "./types";
import { generateReport } from '../holistic-approach/report-output';
import { formData as mockedFormData } from '../holistic-approach/hardcoded-mocks';
import { type FormData } from '../holistic-approach/io.types';

// Johan's Proposal
export type FormDataType = {
  region: "Europe" | "North America" | "Global"; // ...and more | default: Global
  product: "All products" | "Fine powder"; // ...and more | default: All products
  valueChainStage?: {
    mining: boolean; // default: true
    refining: boolean; // default: true
    firstUse: boolean; // default: true
    endUse: boolean; // default: true
    recycling: boolean; // default: true
  };
  firstUseMode?:
    | "ISIC sectorial analysis"
    | "Representative Companies"
    | "Average"; // default: ISIC sectorial analysis
  contribution?: {
    input: boolean; // default: true
    valueAdded: boolean; // default: true
  };
  effect?: {
    directEffect: boolean; // default: true
    firstRound: boolean; // default: true
    industrialSupport: boolean; // default: true
    incomeEffect: boolean; // default: true
  };
};

const LAST_YEAR = 2022; // TODO: This should be the last year available in the data from the supplier

export const reportService = {
  generateReport: async (data: FormDataType) => {
    const formData: FormData = {
      ...mockedFormData,
      source: {
        ...mockedFormData.source,
        industryMatrix: [
          {
            id: "src-OECD_auth-Wiebe_from-2008_to-2015",
          },
        ],
        industryMetric: [
          {
            id: "src-UNIDO_auth-Wiebe_from-2008_to-2015",
            startYear: 2010,
            endYear: LAST_YEAR - 1,
          },
        ],
      },
      config: {
        ...mockedFormData.config,
        region: data.region,
      },
    };
    const report = await generateReport(formData);

    return data.region === 'Global'? report : (report.find(regionalReport => regionalReport['Region'] === data.region) || null);
  },
};

export type Report = Awaited<ReturnType<typeof reportService.generateReport>>;
