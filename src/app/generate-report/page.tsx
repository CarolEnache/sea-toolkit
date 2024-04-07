"use client";

import { useFormState, useFormStatus } from "react-dom";
import { selectComodityGroupAction, selectComodityAction,selectRegionAction } from "./actions";
import { ComoditiesListType, ProductsListType, RegionsListType } from "./types";

const initialComodityListState: ComoditiesListType = {
  commodityList: [],
  message: null,
};
const initialRegionListState: RegionsListType = {
  regionList: [],
  message: null,
};
const initialProductsListState: ProductsListType = {
  productsList: [],
  message: null,
};

function SubmitButton({ children }: { children: React.ReactElement | string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      {children}
    </button>
  );
}

export default function GenerateReport() {
  const [comodityListState, selectComodityGroup] = useFormState(
    selectComodityGroupAction,
    initialComodityListState
  );
  const [regionListState, selectComodity] = useFormState(
    selectComodityAction,
    initialRegionListState
  );
  const [productsListState, selectRegion] = useFormState(
    selectRegionAction,
    initialProductsListState
  );

  console.log({ productsListState });
  return (
    <>
      <form action={selectComodityGroup} className="flex flex-col">
        <input type="radio" id="html" name="commodity_group" value="metals" /> {" "}
        <label htmlFor="html">Metals</label> {" "}
        <input
          type="radio"
          disabled
          id="css"
          name="commodity_group"
          value="energy"
        />
          <label htmlFor="css">Energy</label> {" "}
        <input
          type="radio"
          id="javascript"
          name="commodity_group"
          value="agricultures"
          disabled
        />
          <label htmlFor="javascript">Agricultures</label>
        <SubmitButton>Select Commodity Group</SubmitButton>
        <p aria-live="polite" className="sr-only" role="status">
          {comodityListState?.message} ?
        </p>
      </form>
      <form action={selectComodity} className="flex flex-col">
        {comodityListState.commodityList?.map((comodity) => (
          <>
            <input
              type="radio"
              id={comodity}
              name="commodity_list"
              value={comodity}
            />
              <label htmlFor={comodity}>{comodity}</label>
          </>
        ))}
        <SubmitButton>Select Commodity</SubmitButton>
      </form>
      <form action={selectRegion} className="flex flex-col">
        {regionListState.regionList?.map((region) => (
          <>
            <input type="checkbox" value={region} id={region} name="regions"/>
            <label htmlFor={region}>{region}</label>
          </>
        ))}
        <SubmitButton>Select regions</SubmitButton>
      </form>
      <form action={selectRegion} className="flex flex-col">
        {productsListState.productsList?.map((product) => (
          <>
            <input type="checkbox" value={product} id={product} name="products"/>
            <label htmlFor={product}>{product}</label>
          </>
        ))}
        <SubmitButton>Select products</SubmitButton>
      </form>
    </>
  );
}
