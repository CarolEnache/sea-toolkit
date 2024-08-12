import { EconomicParameterValuesEnum, ForecastingGroup, ForecastingGroupKey, RegionalReport } from "@/server/holistic-approach/report.types";
import { Dispatch, SetStateAction } from "react";

// Johan's Proposal
export type FormDataType = {
    region?: "Europe" | "North America" | "Global"; // ...and more | default: Global
    product?: "All products" | "Fine powder"; // ...and more | default: All products
    valueChainStage?: {
      mining?: boolean; // default: true
      refining?: boolean; // default: true
      firstUse?: boolean; // default: true
      endUse?: boolean; // default: true
      recycling?: boolean; // default: true
    };
    firstUseMode?:
    | "ISIC sectorial analysis"
    | "Representative Companies"
    | "Average"; // default: ISIC sectorial analysis
    contribution?: {
      input?: boolean; // default: true
      valueAdded?: boolean; // default: true
    };
    effect?: {
      directEffect?: boolean; // default: true
      firstRound?: boolean; // default: true
      industrialSupport?: boolean; // default: true
      incomeEffect?: boolean; // default: true
    };
  };

  export type HandleToggleDataArrayProps<T> = (
    value: T,
    setState: Dispatch<SetStateAction<T[]>>
  ) => void;
  


  export type ChartProps = {
    report: RegionalReport;
    economicParamKey: EconomicParameterValuesEnum;
    chartColors: {
      HIGH: string;
      BASE: string;
      LOW: string;
    };
    keysForecastingGroup: ForecastingGroupKey[];
    selectedForecastingGroup: ForecastingGroupKey[];
    handleToggleDataArray: HandleToggleDataArrayProps<any>;
    index: number;
    setIndexChartFullScreen: (index: number | null) => void;
    indexChartFullScreen: number | null;
    dates: string[];
  };
  
  

  
