import OECDRawPart0 from "../data/json/OECD/2015/OECDRawIO.part0.json";
import OECDRawPart1 from "../data/json/OECD/2015/OECDRawIO.part1.json";
import OECDRawPart2 from "../data/json/OECD/2015/OECDRawIO.part2.json";
import OECDEmployment from "../data/json/OECD/2015/OECDEmployment.part0.json";
import { getRegions } from '../data/parquet/read';

export const oecdService = {
  getRegions,
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
