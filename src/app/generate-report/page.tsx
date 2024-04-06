"use client";

import { useFormState, useFormStatus } from "react-dom";
import { selectComodityList, selectRegionList } from "./actions";
import { ComoditiesListType, RegionsListType } from "./types";

const initialComodityListState: ComoditiesListType = {
  commodityList: [],
  message: null,
};
const initialRegionListState: RegionsListType = {
  regionList: [],
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
  const [comodityListState, selectComodityGroupAction] = useFormState(
    selectComodityList,
    initialComodityListState
  );
  const [regionListState, selectRegionAction] = useFormState(
    selectRegionList,
    initialComodityListState
  );

  console.log({ regionListState });
  return (
    <>
      <form action={selectComodityGroupAction} className="flex flex-col">
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
      <form action={selectRegionAction}>
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
    </>
  );
}
