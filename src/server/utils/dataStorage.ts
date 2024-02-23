import OECDRawPart0 from "../../data/OECD/2015/OECDRawIO.part0.json";
import OECDRawPart1 from "../../data/OECD/2015/OECDRawIO.part1.json";
import OECDRawPart2 from "../../data/OECD/2015/OECDRawIO.part2.json";
import OECDEmployment from "../../data/OECD/2015/OECDEmployment.part0.json";

import UnidoREV3Part0 from "../../data/UNIDO/REV3/MINSTAT.part0.json";
import UnidoREV3Part1 from "../../data/UNIDO/REV3/MINSTAT.part1.json";
import UnidoREV3Part2 from "../../data/UNIDO/REV3/MINSTAT.part2.json";
import UnidoREV3Part3 from "../../data/UNIDO/REV3/MINSTAT.part3.json";
import UnidoREV3Part4 from "../../data/UNIDO/REV3/MINSTAT.part4.json";
import UnidoREV3Part5 from "../../data/UNIDO/REV3/MINSTAT.part5.json";
import UnidoREV4Part0 from "../../data/UNIDO/REV4/MINSTAT.part0.json";
import UnidoRECYCLING from "../../data/UNIDO/REV3/RECYCLING.part0.json";

export { default as CoEndUse } from "../../data/MSR/COBALT/Co_End_Use.new.json";
export { default as CoFirstUse } from "../../data/MSR/COBALT/Co_First_Use.new.json";
export { default as CoEndUseDistribution } from "../../data/MSR/COBALT/Co_End_Use_Distribution.new.json";
export { default as CoFirstUseDistribution } from "../../data/MSR/COBALT/Co_First_Use_Distribution.new.json";
export { default as MSRRawData } from "../../data/MSR/COBALT/Co_MSR_Raw_Data.new.json";

export { default as CoPrices } from "../../data/MARKETS/COBALT/prices.json";

const OECDRawInputOutput = [].concat(
  OECDRawPart0 as [],
  OECDRawPart1 as [],
  OECDRawPart2 as []
);

const UnidoRaw = [].concat(
  UnidoREV3Part0 as [],
  UnidoREV3Part1 as [],
  UnidoREV3Part2 as [],
  UnidoREV3Part3 as [],
  UnidoREV3Part4 as [],
  UnidoREV3Part5 as [],
  (UnidoREV4Part0 as any[])
    .slice(1)
    .map((row) => [
      ...row.slice(0, 4),
      row[row.length - 1],
      ...row.slice(4, -1),
    ]) as [],
  (UnidoRECYCLING as any[])
    .slice(1)
    .map((row) => [
      ...row.slice(0, 4),
      row[row.length - 1],
      ...row.slice(4, -1),
    ]) as []
);

export { OECDRawInputOutput, OECDEmployment };

export { UnidoRaw };
