import { runDbQuery } from "../data/parquet/db";

export type Unido = {
  "Table Description": string,
  "Region": string,
  "Year": number,
  "ISIC": string,
  "Value": number,
}

export const unidoService = {
  getUnido: () => runDbQuery<Unido[]>('get-unido', 'src:UNIDO_auth:Wiebe_from:2008_to:2015'),
};
