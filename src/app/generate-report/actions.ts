"use server";

import { FirstUseMode, UUID } from "@/server/holistic-approach/io.types";
import { generateReport } from "@/server/holistic-approach/report-output";
import { getProductsFrom, getRegionsFrom } from "@/server/holistic-approach/selectors";

export const testAction = async () => {
  // const regions = await getRegionsFrom("");
  // const products = await getProductsFrom("");
  // const report = await generateReport({
  //   source: {
  //     market: [
  //       {
  //         id: "COBALT | Wiebe-2019",
  //       },
  //     ],
  //     model: {
  //       id: "COBALT | Enache-Costas-2023",
  //     },
  //     manufacturing: {
  //       id: "COBALT INSTITUTE 2019",
  //       startYear: 2022,
  //       endYear: 2030,
  //     },
  //     industryMatrix: [
  //       {
  //         id: "OECD | Wiebe 2015",
  //       },
  //     ],
  //     industryMetric: [
  //       {
  //         id: "UNIDO | Wiebe 2015",
  //         startYear: 2010,
  //         endYear: 2022 - 1,
  //       },
  //     ],
  //   },
  //   config: {
  //     region: "Europe", // options provided by handleIndustryMatrixSourceSelection
  //     priceForecast: "TwentyPerCent",
  //     products: "All Products", // options provided by handleManufacturingSourceSelection
  //     firstUseMode: FirstUseMode.Average,
  //     include: {
  //       commodityValueAdded: true,
  //       firstUseValueAdded: true,
  //       endSectors: true,
  //       incomeEffects: true,
  //     },
  //     report: {
  //       org: "Cobalt Institute",
  //       copy: "Socio-Economic Analyser",
  //       authors: ["Johann Wiebe", "Carol Enache", "Cesar Costas"],
  //     },
  //   },
  //   generated: {
  //     report: {
  //       compiler: "Socio-Economic Analysis Toolkit",
  //       id: crypto.randomUUID() as UUID,
  //     },
  //   },
  // });

  // console.log({ regions, products, report });
  return JSON.parse(JSON.stringify([]));
};
