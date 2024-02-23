import type { MSRID, OECDID } from "./io.types";

import { products, regions } from "./hardcoded-mocks";

export const getRegionsFrom = (id: OECDID) => {
  return regions;
};

export const getProductsFrom = (id: MSRID) => {
  return products;
};
