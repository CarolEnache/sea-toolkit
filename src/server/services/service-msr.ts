import { default as CoEndUse } from "../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use.new.json";
import { default as CoFirstUse } from "../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use.new.json";
import { default as CoEndUseDistribution } from "../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use_Distribution.new.json";
import { default as CoFirstUseDistribution } from "../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use_Distribution.new.json";
import { default as MSRRawData } from "../approach/data-to-report/data/json/MSR/COBALT/Co_MSR_Raw_Data.new.json";
import { runDbQuery } from "../approach/data-to-report/data/parquet/db";

export type Product = { Product: string };
// The ID that points to certain MSR dataset
export type MSRID = 'src-MSR';

export const msrService = {
  getProducts: async (id: MSRID) => runDbQuery<Product[]>(
    'get-products',
    id
  ),
  async getEndUse() {
    return CoEndUse;
  },
  async getFirstUse() {
    return CoFirstUse;
  },
  async getEndUseDistribution() {
    return CoEndUseDistribution;
  },
  async getFirstUseDistribution() {
    return CoFirstUseDistribution;
  },
  async getMSR() {
    return MSRRawData;
  },
};
