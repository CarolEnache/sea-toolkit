"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  selectComodityGroupAction,
  selectComodityAction,
  selectRegionAction,
} from "./actions";
import {
  ComoditiesListType,
  OnSubmitEvent,
  ProductsListType,
  RegionsListType,
} from "./types";
import { useState } from "react";

const initialComodityListState: ComoditiesListType = {
  commodityList: [],
  valueChainStage: [],
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
  const [selectedComodity, setSelectedComodity] = useState("");
  const [selectedValueChainStage, setValueChainStageSelection] = useState([""]);
  const [regionListState, setRegionsList] = useState<RegionsListType>();

  const [comodityListState, selectComodityGroup] = useFormState(
    selectComodityGroupAction,
    initialComodityListState
  );

  console.log({
    COMODITY_GROUP: 'Metals',
    selectedComodity,
    selectedValueChainStage
  })

  const [productsListState, selectRegion] = useFormState(
    selectRegionAction,
    initialProductsListState
  );
  const handleComoditySelection = async (event: OnSubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const comodity = formData.get("commodity_list");
    setSelectedComodity(comodity as string);
    const regionList = await selectComodityAction(
      initialRegionListState,
      formData
    );
    setRegionsList(regionList);
  };

  const handleValueChainStageSelection = async (event: OnSubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const comodity = formData.getAll("value_chain_stage");
    setValueChainStageSelection(comodity as string[]);
  };

  return (
    <>
      <form action={selectComodityGroup} className="flex flex-col">
        <input type="radio" id="metals" name="commodity_group" value="metals" /> {" "}
        <label htmlFor="metals">Metals</label> {" "}
        <input
          type="radio"
          disabled
          id="energy"
          name="commodity_group"
          value="energy"
        />
          <label htmlFor="energy">Energy</label> {" "}
        <input
          type="radio"
          id="agricultures"
          name="commodity_group"
          value="agricultures"
          disabled
        />
          <label htmlFor="agricultures">Agricultures</label>
        <SubmitButton>Select Commodity Group</SubmitButton>
        <p aria-live="polite" className="sr-only" role="status">
          {comodityListState?.message} ?
        </p>
      </form>

      <form onSubmit={handleComoditySelection} className="flex flex-col">
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
      <form onSubmit={handleValueChainStageSelection} className="flex flex-col">
      {/* <form action={selectComodity} onSubmit={handleComoditySelection} className="flex flex-col"> */}
        {comodityListState.valueChainStage?.map((stage) => (
          <>
            <input
              type="checkbox"
              id={stage}
              name="value_chain_stage"
              value={stage}
            />
              <label htmlFor={stage}>{stage}</label>
          </>
        ))}
        <SubmitButton>Select Value Chain Stage</SubmitButton>
      </form>
      <form action={selectRegion} className="flex flex-col">
        {regionListState?.regionList?.map((region) => (
          <>
            <input
              type="checkbox"
              value={region}
              id={region}
              name="regions"
              onChange={() => console.log("set regions", region)}
            />
            <label htmlFor={region}>{region}</label>
          </>
        ))}
        {regionListState?.message && <p>{regionListState?.message}</p>}
        <SubmitButton>Select regions</SubmitButton>
      </form>
      <form className="flex flex-col">
        {/* <form action={selectRegion} className="flex flex-col" onSubmit={handleSubmit}> */}
        {productsListState.productsList?.map((product) => (
          <>
            <input
              type="checkbox"
              value={product}
              id={product}
              name="products"
              onChange={() => console.log("set products", product)}
            />
            <label htmlFor={product}>{product}</label>
          </>
        ))}
        <SubmitButton>Select products</SubmitButton>
      </form>
    </>
  );
}
