import type { MSRID, OECDID } from "./io.types";

import { products, regions } from "./hardcoded-mocks";
import { oecdService } from "../approach/data-to-report/services/oecd-service";
import { Region } from "../approach/data-to-report/data/parquet/read";

export const getRegionsFrom = async (id: OECDID): Promise<Region[]> => {
  if (process.env.SEA_FLAG?.split(',').includes('python')) {
    return oecdService.getRegions(id);
  }

  return regions;
};

export const getProductsFrom = (id: MSRID) => {
  return products;
};
