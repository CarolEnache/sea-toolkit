import type { OneOf, ParquetFiles } from '@/server/services/db-types';
import type { Industry } from '../types';
import { runDbQuery } from '@/server/services/db';
import OECDEmployment from '../../approach/data-to-report/data/json/OECD/2015/OECDEmployment.part0.json';

import OECDRawPart0 from '../../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part0.json';
import OECDRawPart1 from '../../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part1.json';
import OECDRawPart2 from '../../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part2.json';

export type Region = { Region: string };
type OecdIndustry = { COL: string; To: string };
// The ID that points to certain OECD dataset
export type OECDID = OneOf<ParquetFiles, 'oecd.wiebe_2008-2015'>;

export function getRegions(id: OECDID) {
  return runDbQuery<Region[]>(
    'oecd.get_regions',
    id,
  );
}

export function getIndustries(id: OECDID) {
  return runDbQuery<OecdIndustry[]>(
    'oecd.get_oecd-codes',
    id,
  ).then(values => values.map<Industry>(oecd => ({
    oecd: oecd.COL,
    oecdDescription: oecd.To,
  })));
}

// TODO: Move this to DB
export async function getIndustryData() {
  return [].concat(
    OECDRawPart0 as [],
    OECDRawPart1 as [],
    OECDRawPart2 as [],
  );
}

// TODO: Move this to DB
export async function getEmployment() {
  return OECDEmployment;
}
