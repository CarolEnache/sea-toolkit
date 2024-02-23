import type { FormData, UUID } from "./io.types";

import crypto from "node:crypto";

import { FirstUseMode } from "./io.types";

const LAST_YEAR = 2022; // TODO: This should be the last year available in the data from the supplier
export const formData: FormData = {
  source: {
    market: [
      {
        id: "COBALT | Wiebe-2019",
      },
    ],
    model: {
      id: "COBALT | Enache-Costas-2023",
    },
    manufacturing: {
      id: "COBALT INSTITUTE 2019",
      startYear: LAST_YEAR,
      endYear: 2030,
    },
    industryMatrix: [
      {
        id: "OECD | Wiebe 2015",
      },
    ],
    industryMetric: [
      {
        id: "UNIDO | Wiebe 2015",
        startYear: 2010,
        endYear: LAST_YEAR - 1,
      },
    ],
  },
  config: {
    region: "Europe", // options provided by handleIndustryMatrixSourceSelection
    priceForecast: "TwentyPerCent",
    products: "All Products", // options provided by handleManufacturingSourceSelection
    firstUseMode: FirstUseMode.Average,
    include: {
      commodityValueAdded: true,
      firstUseValueAdded: true,
      endSectors: true,
      incomeEffects: true,
    },
    report: {
      org: "Cobalt Institute",
      copy: "Socio-Economic Analyser",
      authors: ["Johann Wiebe", "Carol Enache", "Cesar Costas"],
    },
  },
  generated: {
    report: {
      compiler: "Socio-Economic Analysis Toolkit",
      id: crypto.randomUUID() as UUID,
    },
  },
};

const REGIONS = {
  GLOBAL: "Global",
  EUROPE: "Europe",
  NORTH_AMERICA: "North America",
  OTHER_AMERICA: "South & Central America",
  ASIA: "Asia, ex-China",
  OCEANIA: "Oceania",
  AFRICA: "Africa",
  CZ: "China",
  US: "USA",
  CD: "DRC",
};
export const regions = [
  REGIONS.GLOBAL,
  REGIONS.CZ,
  REGIONS.AFRICA,
  REGIONS.EUROPE,
  REGIONS.NORTH_AMERICA,
  REGIONS.ASIA,
  REGIONS.OCEANIA,
  REGIONS.OTHER_AMERICA,
];

export const products = ['Cobalt product', 'Carboxylates', 'Metal', 'Oxides', 'Salts', 'Scrap'];
