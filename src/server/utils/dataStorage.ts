import OECDEmployment from '../approach/data-to-report/data/json/OECD/2015/OECDEmployment.part0.json';
import OECDRawPart0 from '../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part0.json';
import OECDRawPart1 from '../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part1.json';
import OECDRawPart2 from '../approach/data-to-report/data/json/OECD/2015/OECDRawIO.part2.json';

export { default as CoPrices } from '../../data/MARKETS/COBALT/prices.json';
export { default as CoEndUse } from '../../data/MSR/COBALT/Co_End_Use.new.json';
export { default as CoEndUseDistribution } from '../../data/MSR/COBALT/Co_End_Use_Distribution.new.json';
export { default as CoFirstUse } from '../../data/MSR/COBALT/Co_First_Use.new.json';
export { default as CoFirstUseDistribution } from '../../data/MSR/COBALT/Co_First_Use_Distribution.new.json';

export { default as MSRRawData } from '../../data/MSR/COBALT/Co_MSR_Raw_Data.new.json';

const OECDRawInputOutput = [].concat(
  OECDRawPart0 as [],
  OECDRawPart1 as [],
  OECDRawPart2 as [],
);

export { OECDEmployment, OECDRawInputOutput };
