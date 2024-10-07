import type { msrService, oecdService } from "@/server/services";

export type ComoditiesListType = {
  commodityList: string[] | null;
  valueChainStage: string[] | null;
  message: string | null;
};
export type RegionsListType = {
  regionList: oecdService.Region[] | null;
  message: string | null;
};
export type ProductsListType = {
  productsList: msrService.Product[] | null;
  message: string | null;
};
