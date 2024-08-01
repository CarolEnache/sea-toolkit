import { runDbQuery } from "../db";
import * as naceService from "./nace";
import * as oecdService from "./oecd";
import * as unidoService from "./unido";
import { Industry } from "../types";

export type AnalystIndustries = {
  OECD: string;
  ISIC: string;
  NACE: string;
}

export function addAnalystIndustries(insert: AnalystIndustries | AnalystIndustries[]) {
  return runDbQuery<AnalystIndustries[]>(
    'footprint.add_analyst-industries',
    'footprint.analyst-industries',
    { insert },
  );
}

export function delAnalystIndustries(where: Pick<AnalystIndustries, 'NACE'>) {
  return runDbQuery<AnalystIndustries[]>(
    'footprint.del_analyst-industries',
    'footprint.analyst-industries',
    { where },
  );
}

export function getAnalystIndustries() {
  return runDbQuery<AnalystIndustries[]>(
    'footprint.get_analyst-industries',
    'footprint.analyst-industries',
  );
}

// intAnalystIndustries // Has no multiple sources
// modAnalystIndustries // No feature for modifying a report yet
// pivAnalystIndustries // Has no aggregation

export async function getIndustries() {
  const [oecdIndustries, unidoIndustries, naceIndustries, analystIndustries] = await Promise.all([
    oecdService.getIndustries('oecd.wiebe_2008-2015'),
    unidoService.getIndustries('unido.wiebe_2008-2015'),
    naceService.getIndustries('nace.europa-eu_2024'),
    getAnalystIndustries(),
  ]);
  const CodeMatcher = {
    nace: naceIndustries.map((industry: Industry) => ({
      ...industry,
      url: `https://publications.europa.eu/resource/authority/ux2/nace2/${industry.nace?.slice(1)}`,
      naceMatch: industry.nace?.slice(1),
    })),
    oecd: oecdIndustries.map((industry: Industry) => ({
      ...industry,
      oecdMatch: industry.oecd?.slice(1).split('T'),
    })),
    isic: unidoIndustries.map((industry: Industry) => {
      let isicMatch;
      // The leading 0 has been missed due number format in excel
      if (industry.isic?.length === 3 || industry.isic?.length === 1) isicMatch = `0${industry.isic}`;

      return {
        ...industry,
        isicMatch,
      };
    }),
  };

  return CodeMatcher.nace.flatMap((a) => {
    // We search for the specific
    let oecdDef = CodeMatcher.oecd.find(b => a.naceMatch === b.oecdMatch?.join(''));
    let isicDef = CodeMatcher.isic.find(b => a.naceMatch === b.isicMatch);
    let linkDef = analystIndustries.find(b => a.nace === b.NACE);

    // Manual link found
    if (linkDef) {
      oecdDef = CodeMatcher.oecd.find(b => `${linkDef?.OECD}` === `${b.oecd}`);
      isicDef = CodeMatcher.isic.find(b => `${linkDef?.ISIC}` === `${b.isic}`);
    }

    // Then for the generic
    if (!oecdDef) oecdDef = CodeMatcher.oecd.find(b => a.naceMatch?.slice(0, 2) === b.oecdMatch?.[0]);
    if (!isicDef) isicDef = CodeMatcher.isic.find(b => a.naceMatch?.slice(0, 2) === b.isicMatch?.slice(0, 2));

    // if (!oecdDef && !isicDef) return [null, oecdDef, isicDef];
    if (!oecdDef || !isicDef) return null;

    const result = {
      ...a,
      ...oecdDef,
      ...isicDef,
    };

    delete result.naceMatch;
    delete result.oecdMatch;
    delete result.isicMatch;

    return result;
  }).filter(Boolean);
}
