import { runDbQuery } from "../approach/data-to-report/data/parquet/db";
import { Industry } from "./types";

export type Unido = {
  "Table Description": string,
  "Region": string,
  "Year": number,
  "ISIC": string,
  "Value": number,
}
// The ID that points to certain Unido dataset
export type UNIDOID = "src-UNIDO_auth-Wiebe_from-2008_to-2015";

type UnidoIndustry = {
  "ISIC": string,
  "ISIC Description": string,
}

export const unidoService = {
  getUnido: (id: UNIDOID) => runDbQuery<Unido[]>(
    'get-unido',
    id
  ),
  getIndustries: (id: UNIDOID) => runDbQuery<UnidoIndustry[]>(
    'get-unido-industries',
    id
  ).then(values => values.map<Industry>(unidoIndustry => ({
    isic: unidoIndustry['ISIC'],
    isicDescription: unidoIndustry['ISIC Description'],
  }))),
};
