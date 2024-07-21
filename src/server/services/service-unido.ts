import { runDbQuery } from "../approach/data-to-report/data/parquet/db";
import { Industry } from "./types";

export type Unido = {
  "Table Description": string,
  "Region": string,
  "Year": number,
  "ISIC": string,
  "Value": number,
}

type UnidoIndustry = {
  "ISIC": string,
  "ISIC Description": string,
}

export const unidoService = {
  getUnido: () => runDbQuery<Unido[]>(
    'get-unido',
    'src-UNIDO_auth-Wiebe_from-2008_to-2015'
  ),
  getIndustries: () => runDbQuery<UnidoIndustry[]>(
    'get-unido-industries',
    'src-UNIDO_auth-Wiebe_from-2008_to-2015'
  ).then(values => values.map<Industry>(unidoIndustry => ({
    isic: unidoIndustry['ISIC'],
    isicDescription: unidoIndustry['ISIC Description'],
  }))),
};
