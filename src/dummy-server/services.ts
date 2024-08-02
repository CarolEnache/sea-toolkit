import {
  type msrService as MsrService,
  type oecdService as OecdService,
  type reportService as ReportService,
} from "@/server/services";
import report from './report.json';

export const msrService: typeof MsrService = {
  async getProducts() {
    return [{Product:"Cathode"},{Product:"FinePowder"},{Product:"Chloride"},
      {Product:"Ore"},{Product:"Other"},{Product:"Sulphate"},{Product:"Tetroxide"}];
  },
  async getEndUse() { return [[]]; },
  async getEndUseDistribution() { return [[]]; },
  async getFirstUse() { return [[]]; },
  async getFirstUseDistribution() { return [[]]; },
  async getMSR() { return [[]]; }
};

export const oecdService: typeof OecdService = {
  async getRegions() {
    return [{Region:"South & Central America"},{Region:"China"},
      {Region:"Africa"},{Region:"Asia, ex-China"},{Region:"North America"},
      {Region:"Oceania"},{Region:"Europe"}];
  },
  async getEmployment() { return {}; },
  async getIndustries() { return [{}]; },
  async getIndustryData() { return []; },
};

export const reportService: typeof ReportService = {
  async requestReport() {
    return `${crypto.randomUUID().slice(-8)}_mvp-dev`;
  },
  async generateReport(id: string) {
    return report as unknown as ReportService.Report;
  },
};
