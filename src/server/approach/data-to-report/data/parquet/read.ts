import { query, read_parquet } from './duck-await-db';

import { OECDID } from '@/server/holistic-approach/io.types';

export type Region = { Region: string };
export const getRegions = (id: OECDID) => query<Region[]>(`SELECT DISTINCT region FROM ${read_parquet(id)}`);

export type Unido = {
  "Table Description": string,
  "Region": string,
  "Year": number,
  "ISIC": string,
  "Value": number,
}
export const getUnido = () => query<Unido[]>(`SELECT "Table Description", "Region", "Year", "ISIC", SUM(CASE WHEN "Value" = '...' THEN 0 ELSE CAST("Value" AS BIGINT) END) AS "Value" FROM ${read_parquet('src:UNIDO_auth:Wiebe_from:2008_to:2015')} GROUP BY "Table Description", "Region", "Year", "ISIC"`);
