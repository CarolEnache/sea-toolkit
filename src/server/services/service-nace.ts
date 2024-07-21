import { runDbQuery } from "../approach/data-to-report/data/parquet/db";
import { Industry } from "./types";

type NaceIndustry = {
  "NACE code": string;
  "NACE description": string;
};

export const naceService = {
  getIndustries: () => runDbQuery<NaceIndustry[]>(
    'get-nace-industries',
    'src-NACE'
  ).then(values => values.map<Industry>(naceIndustry => ({
    nace: naceIndustry['NACE code'],
    naceDescription: naceIndustry['NACE description'],
  }))),
};
