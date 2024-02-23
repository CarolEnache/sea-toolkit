"use client"

import { useFormState, useFormStatus } from "react-dom";

import { testAction } from "./actions";

import { RadioGroup } from "@/components/radio-group";
// import { RadioGroup } from "../../../components/radio-group";

// listOfRadiosToBeReplaced should be replaced by a BE response
const listOfRadiosToBeReplaced = [
  {
    description: "Generate report on a metal",
    value: "metals",
    child: "Metals",
  },
  {
    description: "Generate report on a source of enery",
    value: "energy",
    child: "Energy",
  },
  {
    description: "Generate report agriculturals",
    value: "agriculturals",
    child: "Agriculturals",
  },
];

const initialState: string[] = [];

export default function GenerateReport() {
  const [state, formAction] = useFormState(testAction, initialState);
  console.log({state})

  return (
    <>
      <form>
        <RadioGroup
          label="Please select the type of comodity:"
          radioList={listOfRadiosToBeReplaced}
        />
      </form>
      <form action={formAction}>
        <input type="submit" />
      </form>
    </>
  );
}
