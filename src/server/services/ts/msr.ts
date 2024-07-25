import { default as CoEndUse } from "../../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use.new.json";
import { default as CoFirstUse } from "../../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use.new.json";
import { default as CoEndUseDistribution } from "../../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use_Distribution.new.json";
import { default as CoFirstUseDistribution } from "../../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use_Distribution.new.json";
import { default as MSRRawData } from "../../approach/data-to-report/data/json/MSR/COBALT/Co_MSR_Raw_Data.new.json";
import { runDbQuery } from "../db";
import { OneOf, ParquetFiles } from "../db-types";

export type Product = { Product: string };
// The ID that points to certain MSR dataset
export type MSRID = OneOf<ParquetFiles, 'msr.cobalt-insitute_2019'>;

export function getProducts(id: MSRID) {
  return runDbQuery<Product[]>(
    'msr.get_products',
    id
  );
}

export async function getEndUse() {
  return CoEndUse;
}

export async function getFirstUse() {
  return CoFirstUse;
}

export async function getEndUseDistribution() {
  return CoEndUseDistribution;
}

export async function getFirstUseDistribution() {
  return CoFirstUseDistribution;
}

export async function getMSR() {
  return MSRRawData;
}
