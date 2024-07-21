import { runDbQuery } from "../approach/data-to-report/data/parquet/db";
import { Industry } from "./types";

type NaceIndustry = {
  "NACE code": string;
  "NACE description": string;
};
export type NACEID = 'src-NACE-2_auth-EuropaEU_year-2024';

export const naceService = {
  getIndustries: (id: NACEID) => runDbQuery<NaceIndustry[]>(
    'get-nace-industries',
    id
  ).then(values => values.map<Industry>(naceIndustry => ({
    nace: naceIndustry['NACE code'],
    naceDescription: naceIndustry['NACE description'],
  }))),
};
