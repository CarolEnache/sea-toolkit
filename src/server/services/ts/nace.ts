import { runDbQuery } from "../db";
import { OneOf, ParquetFiles } from "../db-types";
import { Industry } from "../types";

type NaceIndustry = {
  "NACE code": string;
  "NACE description": string;
};
export type NACEID = OneOf<ParquetFiles, 'nace.europa-eu_2024'>;

export function getIndustries(id: NACEID) {
  return runDbQuery<NaceIndustry[]>(
    'nace.get_nace-codes',
    id
  ).then(values => values.map<Industry>(naceIndustry => ({
    nace: naceIndustry['NACE code'],
    naceDescription: naceIndustry['NACE description'],
  })));
}
