import { type Region } from "@/server/services";

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
  productsList: string[] | null;
  message: string | null;
};

export type OnSubmitEvent = {
  preventDefault: () => void;
  target: HTMLFormElement | undefined;
};
