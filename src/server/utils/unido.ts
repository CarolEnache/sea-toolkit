import { UnidoRaw } from "./dataStorage";
import {
  UnidoTitles,
  AccumulatorIndexCacheType,
  UnidoRawType,
  RestructuredCurrentType,
} from "./types";

export const unido = () => {
  const accumulatorIndexCache: AccumulatorIndexCacheType = {};
  
  return (UnidoRaw as UnidoRawType)
    .slice(1)
    .reduce((accumulator: RestructuredCurrentType[], current: string[]) => {
      const restructuredCurrent: RestructuredCurrentType = {
        "Table Description": current[UnidoTitles.TableDescription],
        Region: current[UnidoTitles.Region],
        Year: Number(current[UnidoTitles.Year]),
        ISIC: current[UnidoTitles.ISIC],
        Value: Number(current[UnidoTitles.Value]),
      };

      if (isNaN(restructuredCurrent.Value)) restructuredCurrent.Value = 0;

      const cacheKey = Object.values(restructuredCurrent)
        .slice(0, -1)
        .toString();

      if (accumulatorIndexCache[cacheKey]) {
        accumulator[accumulatorIndexCache[cacheKey]].Value +=
          restructuredCurrent.Value;
      } else {
        accumulatorIndexCache[cacheKey] = accumulator.length;
        accumulator.push(restructuredCurrent);
      }

      return accumulator;
    }, []);
};
