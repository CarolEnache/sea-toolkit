import { runDbQuery } from "../db";
import { OneOf, ParquetFiles } from "../db-types";
import { Industry } from "../types";

export type Unido = {
  "Table Description": string,
  "Region": string,
  "Year": number,
  "ISIC": string,
  "Value": number,
}
// The ID that points to certain Unido dataset
export type UNIDOID = OneOf<ParquetFiles, 'unido.wiebe_2008-2015'>;

type UnidoIndustry = {
  "ISIC": string,
  "ISIC Description": string,
}

export function getUnido(id: UNIDOID) {
  return runDbQuery<Unido[]>(
    'unido.pivot_region-year-isic',
    id
  );
}

export function getIndustries(id: UNIDOID) {
  return runDbQuery<UnidoIndustry[]>(
    'unido.get_isic-codes',
    id
  ).then(values => values.map<Industry>(unidoIndustry => ({
    isic: unidoIndustry['ISIC'],
    isicDescription: unidoIndustry['ISIC Description'],
  })));
}
