import { type Product, type Region } from "@/server/services";

export type ComoditiesListType = {
  commodityList: string[] | null;
  valueChainStage: string[] | null;
  message: string | null;
};
export type RegionsListType = {
  regionList: Region[] | null;
  message: string | null;
};
export type ProductsListType = {
  productsList: Product[] | null;
  message: string | null;
};
