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
  const [selectedComodity, setSelectedComodity] = useState<any>("");
  const [selectedValueChainStage, setValueChainStageSelection] = useState<any>([""]);
  const [regionListState, setRegionsList] = useState<RegionsListType>();
  const [selectedRegions, setSelectedRegions] = useState<any>([]);
  const [productsListState, setProductsListState] = useState([])

  const [comodityListState, selectComodityGroup] = useFormState(
    selectComodityGroupAction,
    initialComodityListState
  );

  console.log({
    COMODITY_GROUP: "Metals",
    selectedComodity,
    selectedValueChainStage,
    selectedRegions
  });

  // const [productsListState, selectRegion] = useFormState(
  //   selectRegionAction,
  //   initialProductsListState
  // );
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

  const handleRegionSelection = async (event: OnSubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedRegions = formData.getAll("regions");
    if (selectedRegions.includes('global')) {
      setSelectedRegions(regionListState?.regionList?.map(({ Region: region }) => region).concat('global'));  
    } else {
      setSelectedRegions(selectedRegions);
    }
    // const productsList = await selectRegionAction(selectedRegions)
    // setProductsListState(productsList)
  };


  const handleFirstUseModeSelection = async (event: OnSubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedFirtsUse = formData.get("first-use");

    console.log(selectedFirtsUse);
  };

  const handleContributionSelection = async (event: OnSubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedContributionType = formData.getAll("contribution");

    console.log(selectedContributionType);
  };

  const handleEffectSelection = async (event: OnSubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedEffect = formData.getAll("effect");

    console.log(selectedEffect);
  };

  return (
    <>
      <form action={selectComodityGroup} className="flex flex-col">
        <input type="radio" id="metals" name="commodity_group" value="metals" />
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
        {/* <p aria-live="polite" className="sr-only" role="status">
          {comodityListState?.message} ?
        </p> */}
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
      <form className="flex flex-col" onSubmit={handleRegionSelection}>
      {/* <form action={selectRegion} className="flex flex-col"> */}
          <>
            <input
              type="checkbox"
              value="global"
              id="region:global"
              name="regions"
            />
            <label htmlFor="region:global">Global</label>
          </>
        {regionListState?.regionList?.map(({ Region: region }) => (
          <>
            <input
              type="checkbox"
              value={region}
              id={region}
              name="regions"
            />
            <label htmlFor={region}>{region}</label>
          </>
        ))}
        {regionListState?.message && <p>{regionListState?.message}</p>}
        <SubmitButton>Select regions</SubmitButton>
      </form>
      <form className="flex flex-col">
        {/* <form action={selectRegion} className="flex flex-col" onSubmit={handleSubmit}> */}
        {productsListState?.map((product) => (
          <>
            <input
              type="checkbox"
              value={product}
              id={product}
              name="products"
            />
            <label htmlFor={product}>{product}</label>
          </>
        ))}
        <SubmitButton>Select products</SubmitButton>
      </form>
      <form className="flex flex-col" onSubmit={handleFirstUseModeSelection}>
        <input
          type="radio"
          name="first-use"
          id="sectorial-analysis"
          value="sectorial-analysis"
        />
        <label htmlFor="sectorial-analysis">ISIC sectorial analysis</label>
        <input
          type="radio"
          name="first-use"
          id="representative-companies"
          value="representative-companies"
        />
        <label htmlFor="representative-companies">
          Representative Companies
        </label>
        <input type="radio" name="first-use" id="average" value="average" />
        <label htmlFor="average">Average</label>
        this omne
        <SubmitButton>Select Fisrt Use Mode</SubmitButton>
      </form>
      <form className="flex flex-col" onSubmit={handleContributionSelection}>
        <input type="checkbox" name="contribution" id="input" value="input" />
        <label htmlFor="input">Input</label>
        <input
          type="checkbox"
          name="contribution"
          id="value-added"
          value="value-added"
        />
        <label htmlFor="value-added">Value Added</label>
        <SubmitButton>Select contribution</SubmitButton>
      </form>
      <form className="flex flex-col" onSubmit={handleEffectSelection}>
        <input
          type="checkbox"
          name="effect"
          id="direct-effect"
          value="direct-effect"
        />
        <label htmlFor="direct-effect">Direct effect</label>
        <input
          type="checkbox"
          name="effect"
          id="first-round"
          value="first-round"
        />
        <label htmlFor="first-round">First Round</label>
        <input
          type="checkbox"
          name="effect"
          id="industrial-support"
          value="industrial-support"
        />
        <label htmlFor="industrial-support">Industrial Support</label>
        <input
          type="checkbox"
          name="effect"
          id="income-effect"
          value="income-effect"
        />
        <label htmlFor="income-effect">Income effect</label>
        <SubmitButton>Select the Effect</SubmitButton>
      </form>
    </>
  );
}
