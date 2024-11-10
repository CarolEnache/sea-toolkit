import type { OneOf, ParquetFiles } from '@/server/services/db-types';
import { runDbQuery } from '@/server/services/db';
import CoEndUse from '../../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use.new.json';
import CoEndUseDistribution from '../../approach/data-to-report/data/json/MSR/COBALT/Co_End_Use_Distribution.new.json';
import CoFirstUse from '../../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use.new.json';
import CoFirstUseDistribution from '../../approach/data-to-report/data/json/MSR/COBALT/Co_First_Use_Distribution.new.json';
import MSRRawData from '../../approach/data-to-report/data/json/MSR/COBALT/Co_MSR_Raw_Data.new.json';

export type Product = { Product: string };
// The ID that points to certain MSR dataset
export type MSRID = OneOf<ParquetFiles, 'msr.cobalt-insitute_2019'>;

export function getProducts(id: MSRID) {
  return runDbQuery<Product[]>(
    'msr.get_products',
    id,
  );
}

// TODO: Move this to DB
export async function getEndUse() {
  return CoEndUse;
}

// TODO: Move this to DB
export async function getFirstUse() {
  return CoFirstUse;
}

// TODO: Move this to DB
export async function getEndUseDistribution() {
  return CoEndUseDistribution;
}

// TODO: Move this to DB
export async function getFirstUseDistribution() {
  return CoFirstUseDistribution;
}

// TODO: Move this to DB
export async function getMSR() {
  return MSRRawData;
}
