export type ComoditiesListType = {
  commodityList: string[] | null;
  valueChainStage: string[] | null;
  message: string | null;
};
export type RegionsListType = {
  regionList: string[] | null;
  message: string | null;
};
export type ProductsListType = {
  productsList: string[] | null;
  message: string | null;
};

export type SubmitEvent = {
  preventDefault: () => void;
  target: HTMLFormElement | undefined;
};
