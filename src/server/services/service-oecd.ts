import OECDRawPart0 from "../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part0.json";
import OECDRawPart1 from "../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part1.json";
import OECDRawPart2 from "../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part2.json";
import OECDEmployment from "../approach/data-to-report/data/json/OECD/2015/OECDEmployment.part0.json";

import { OECDID } from "@/server/holistic-approach/io.types";
import { runDbQuery } from "../approach/data-to-report/data/parquet/db";

export type Region = { Region: string };

export const oecdService = {
  getRegions: (id: OECDID) => runDbQuery<Region[]>('get-regions', id),
  async getIndustryData() {
    return [].concat(
      OECDRawPart0 as [],
      OECDRawPart1 as [],
      OECDRawPart2 as []
    );
  },
  async getEmployment() {
    return OECDEmployment;
  }
};
