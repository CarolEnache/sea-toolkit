import { runDbQuery } from "../approach/data-to-report/data/parquet/db";
import { naceService } from "./service-nace";
import { oecdService } from "./service-oecd";
import { unidoService } from "./service-unido";
import { Industry } from "./types";

export type AnalystIndustries = {
  OECD: string;
  ISIC: string;
  NACE: string;
}

export const footprintService = {
  getIndustries: async () => {
    const [oecdIndustries, unidoIndustries, naceIndustries, analystIndustries] = await Promise.all([
      oecdService.getIndustries('src-OECD_auth-Wiebe_from-2008_to-2015'),
      unidoService.getIndustries('src-UNIDO_auth-Wiebe_from-2008_to-2015'),
      naceService.getIndustries('src-NACE-2_auth-EuropaEU_year-2024'),
      footprintService.getAnalystIndustries(),
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
        oecdDef = CodeMatcher.oecd.find(b => `${linkDef.OECD}` === `${b.oecd}`);
        isicDef = CodeMatcher.isic.find(b => `${linkDef.ISIC}` === `${b.isic}`);
      }

      // Then for the generic
      if (!oecdDef) oecdDef = CodeMatcher.oecd.find(b => a.naceMatch?.slice(0,2) === b.oecdMatch?.[0]);
      if (!isicDef) isicDef = CodeMatcher.isic.find(b => a.naceMatch?.slice(0,2) === b.isicMatch?.slice(0,2));

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
  },
  getAnalystIndustries: () => runDbQuery<AnalystIndustries[]>(
    'get-analyst-industries',
    'custom-analyst-industries'
  ),
  setAnalystIndustries: (insert: AnalystIndustries | AnalystIndustries[]) => runDbQuery<AnalystIndustries[]>(
    'update-analyst-industries',
    'custom-analyst-industries',
    { insert },
  ),
  deleteAnalystIndustries: (where: Pick<AnalystIndustries, 'NACE'>) => runDbQuery<AnalystIndustries[]>(
    'delete-analyst-industries',
    'custom-analyst-industries',
    { where },
  ),
};
