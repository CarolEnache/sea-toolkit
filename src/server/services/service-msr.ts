import { default as CoEndUse } from "../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use.new.json";
import { default as CoFirstUse } from "../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use.new.json";
import { default as CoEndUseDistribution } from "../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use_Distribution.new.json";
import { default as CoFirstUseDistribution } from "../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use_Distribution.new.json";
import { default as MSRRawData } from "../approach/data-to-report/data/json/MSR/COBALT/Co_MSR_Raw_Data.new.json";
import type { MSRID } from "../holistic-approach/io.types";

export type Product = { Product: string };

export const msrService = {
  async getProducts(id: MSRID): Promise<Product[]> {
    // Hardcoded mock
    return [
      { Product: 'Cobalt product' },
      { Product: 'Carboxylates' },
      { Product: 'Metal' },
      { Product: 'Oxides' },
      { Product: 'Salts' },
      { Product: 'Scrap' },
    ];
  },
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
