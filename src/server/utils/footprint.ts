import { COBALT_HARDCODED_MODEL, FORM_DATA } from "../constants";
import { REGIONS } from "./auxiliary";
import { msr } from "./msr";
import { oecdCoeficients } from "./oecdCoeficients";
import { RestructuredCurrentType } from "./types";
import { unido } from "./unido";

export const getOECDData = () => {
  const { footprint } = oecdCoeficients();
  return footprint;
};

const gapFillingKey = (current: RestructuredCurrentType) =>
  `${current["Table Description"]}-${current.Region}-${current.ISIC}`;

/*
TODO: This gap filling is quite dumb
We replicated the Excel and as an example:
original: [8866, 9116, 9526, 9598, 10102, 10506, 9832, 0, 0, 0, 0, 0, 0, 264, 267, 261]
filled: [8866, 9116, 9526, 9598, 10102, 10506, 9832, 9832, 9832, 9832, 9832, 9832, 9832, 264, 267, 261]
We can see that a trend between 9832 and 264 would be a better predictor than keeping the same value.
*/
const gapFilling = (unidoArray: RestructuredCurrentType[]) => {
  let lastKnownValue: Record<string, number> = {};

  return unidoArray.map((current) => {
    const key = gapFillingKey(current);

    if (current.Value === 0) {
      return {
        ...current,
        Value: lastKnownValue[key],
      };
    }
    lastKnownValue[key] = current.Value;

    return current;
  });
};

type getUnidoDataFn = (params?: { selectedRegion?: string, selectedEconomyUnidoStart?: number,
  selectedEconomyUnidoEnd?: number }) => void;

export const getUnidoData: getUnidoDataFn = ({
  selectedRegion = FORM_DATA.selectedRegion,
  selectedEconomyUnidoStart = FORM_DATA.selectedEconomyUnidoStart,
  selectedEconomyUnidoEnd = FORM_DATA.selectedEconomyUnidoEnd,
} = {}) => {
  const unidoData = unido();
  const numberOfYears = selectedEconomyUnidoEnd - selectedEconomyUnidoStart + 1;

  return COBALT_HARDCODED_MODEL.flatMap((curr) => {
    const isicData = unidoData.filter(
      (data) =>
        (selectedRegion === REGIONS.GLOBAL
          ? true
          : selectedRegion === data.Region) &&
        data.ISIC === curr.ISIC &&
        data.Year && (
          data.Year >= selectedEconomyUnidoStart &&
          data.Year <= selectedEconomyUnidoEnd
        )
    );

    const x =
      gapFilling(isicData).reduce((acc, data) => {
        const key = `${data["Table Description"]}`;

        if (acc[key]) {
          acc[key].Value += (data.Value || 0) * curr.weight / numberOfYears;
        } else {
          acc[key] = structuredClone(data);
          delete acc[key].Year;
          acc[key].Value = (acc[key].Value || 0) * curr.weight / numberOfYears;
          if (selectedRegion === REGIONS.GLOBAL) {
            acc[key].Region = selectedRegion;
          }
        }

        return acc;
      }, {} as Record<string, RestructuredCurrentType>);

    // x['Value Added'] = x['Value Added'].map(b => {b.Value =b.Value / x['Output'].find(wher is equal b).Value); return b; })

    return Object.values(x);
  });
};

export const getMSRData = () => {
  const x = msr();
  return x;
};
