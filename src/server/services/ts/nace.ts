import type { OneOf, ParquetFiles } from '@/server/services/db-types';
import type { Industry } from '../types';
import { runDbQuery } from '@/server/services/db';

type NaceIndustry = {
  'NACE code': string;
  'NACE description': string;
};
export type NACEID = OneOf<ParquetFiles, 'nace.europa-eu_2024'>;

export function getIndustries(id: NACEID) {
  return runDbQuery<NaceIndustry[]>(
    'nace.get_nace-codes',
    id,
  ).then(values => values.map<Industry>(naceIndustry => ({
    nace: naceIndustry['NACE code'],
    naceDescription: naceIndustry['NACE description'],
  })));
}
