//#region FROM DATABASE
// The model ID allows to select different industry links across data sources and weights
export type ModelID = "COBALT | Enache-Costas-2023" | "NICKEL" | "COPPER" | "HYDROGEN";
// The market ID allows to select the source for historical prices of the commodity
export type MarketID = "COBALT | Wiebe-2019" | "NICKEL" | "COPPER" | "HYDROGEN";
// The ID that points to certain MSR dataset
export type MSRID = string | "COBALT INSTITUTE 2019";
// The ID that points to certain Unido dataset
export type UNIDOID = "src-UNIDO_auth-Wiebe_from-2008_to-2015";
// The ID that points to certain OECD dataset
export type OECDID = "src-OECD_auth-Wiebe_from-2008_to-2015";
//#endregion
/**
 * The forecast function allows to choose how to fill future data
 */
enum ForecastFn {
  TwentyPerCent = "TwentyPerCent", // The current default for market forecasting
  Average = "Average", // The current default for other forecasting
  Median = "Median",
  Mode = "Mode",
  LinearRegresion = "LinearRegresion",
  LogaritmicRegresion = "LogaritmicRegresion",
  PolynomialRegresion = "PolynomialRegresion",
}
/**
 * First Use mode
 */
export enum FirstUseMode {
  "ISIC sectorial analysis" = "ISIC sectorial analysis",
  "Representative Companies" = "Representative Companies",
  "Average" = "Average",
}
/**
 * Some silly more verbose types
 */
type StringLength<N extends number> = { 0: string; length: N } & string;
export type UUID =
  `${StringLength<8>}-${StringLength<4>}-${StringLength<4>}-${StringLength<4>}-${StringLength<12>}`;
type AuthorName = string;
type OrgName = string;
type FullYear = number;

interface DataSource<ID extends string> {
  id: ID;
  startYear?: FullYear;
  endYear?: FullYear;
}

export interface FormData {
  // This section is about retrieving data from DB
  source: {
    market: DataSource<MarketID>[]; // Multiple sources for prices
    model: DataSource<ModelID>; // Tailor-made links between data sources
    manufacturing: DataSource<MSRID>; // Customer provided, as far as we know
    industryMatrix: DataSource<OECDID>[]; // Multiple sources for building the industry matrix
    industryMetric: DataSource<UNIDOID>[]; // Multiple sources to get the industry metrics: Value Added, Output,...
  };
  // This section is about configuring the report, it will depend on the source selection
  config: {
    region: string; // From the OECDID
    priceForecast: keyof typeof ForecastFn;
    products: string; // From the MSRID
    firstUseMode: FirstUseMode;
    include: {
      commodityValueAdded: boolean; // Base commodity value + (True? Value Added)
      firstUseValueAdded: boolean; // Value Added at First Use
      endSectors: boolean;
      incomeEffects: boolean;
    };
    report: {
      org: OrgName;
      copy: string;
      authors: AuthorName[];
    };
  };
  // This section is about non-customisable fields
  generated: {
    report: {
      compiler: "Socio-Economic Analysis Toolkit";
      id: UUID;
    };
  };
}
