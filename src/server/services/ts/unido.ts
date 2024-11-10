import type { OneOf, ParquetFiles } from '@/server/services/db-types';
import type { Industry } from '../types';
import { runDbQuery } from '@/server/services/db';

export type Unido = {
  'Table Description': string;
  'Region': string;
  'Year': number;
  'ISIC': string;
  'Value': number;
};
// The ID that points to certain Unido dataset
export type UNIDOID = OneOf<ParquetFiles, 'unido.wiebe_2008-2015'>;

export function getUnido(id: UNIDOID) {
  return runDbQuery<Unido[]>(
    'unido.pivot_region-year-isic',
    id,
  );
}

type UnidoIndustry = {
  'ISIC': string;
  'ISIC Description': string;
};

export function getIndustries(id: UNIDOID) {
  return runDbQuery<UnidoIndustry[]>(
    'unido.get_isic-codes',
    id,
  ).then(values => values.map<Industry>(each => ({
    isic: each.ISIC,
    isicDescription: each['ISIC Description'],
  })));
}

type EconomicFactor = {
  'Table Description': string;
};

export function getEconomicFactors(id: UNIDOID) {
  return runDbQuery<EconomicFactor[]>(
    'unido_get_economic_factors',
    id,
  ).then(values => values.map<string>(each => each['Table Description']));
}

type EconomicParameter = {
  'Table Description': string;
};

export function getEconomicParameters(id: UNIDOID) {
  return runDbQuery<EconomicParameter[]>(
    'unido_get_economic_parameters',
    id,
  ).then(values => values.map<string>(each => each['Table Description']));
}
