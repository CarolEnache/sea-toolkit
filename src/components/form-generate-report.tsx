"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { Product, Region } from "@/server/services";

// import { ComoditiesListType, ProductsListType, RegionsListType } from "./types";
// import { FormEventHandler, useState } from "react";
// import { generateReport } from "@/server/holistic-approach/report-output";

export type FormDataType = {
  region: "Europe" | "North America" | "Global"; // ...and more | default: Global
  product: "All products" | "Fine powder"; // ...and more | default: All products
  valueChainStage?: {
    mining: boolean; // default: true
    refining: boolean; // default: true
    firstUse: boolean; // default: true
    endUse: boolean; // default: true
    recycling: boolean; // default: true
  };
  firstUseMode?:
    | "ISIC sectorial analysis"
    | "Representative Companies"
    | "Average"; // default: ISIC sectorial analysis
  contribution?: {
    input: boolean; // default: true
    valueAdded: boolean; // default: true
  };
  effect?: {
    directEffect: boolean; // default: true
    firstRound: boolean; // default: true
    industrialSupport: boolean; // default: true
    incomeEffect: boolean; // default: true
  };
};
const valuesChainStage = [
  "mining",
  "refining",
  "firstUse",
  "endUse",
  "recycling",
];
const firstUseModes = [
  "ISIC sectorial analysis",
  "Representative Companies",
  "Average",
];
export const initialState: FormDataType = {
  region: "Global",
  product: "All products",
  valueChainStage: {
    mining: false,
    refining: false,
    firstUse: false,
    endUse: false,
    recycling: false,
  },
  firstUseMode: "ISIC sectorial analysis",
  contribution: {
    input: false,
    valueAdded: false,
  },
  effect: {
    directEffect: false,
    firstRound: false,
    industrialSupport: false,
    incomeEffect: false,
  },
};

export default function GenerateReport({
  formServerAction,
  getDataFormFromServer,
}) {
  const [formState, formAction] = useFormState(formServerAction, initialState);
  const [regions, setRegions] = useState<Region["Region"][]>([]);
  const [products, setProducts] = useState<Product["Product"][]>([]);

  const setDataForm = async () => {
    const res = await getDataFormFromServer();
    setRegions(res.regions);
    setProducts(res.products);
  };

  useEffect(() => {
    setDataForm();
  }, []);

  useEffect(() => {
    if (formState?.report) {
      window.localStorage.setItem("report", JSON.stringify(formState?.report));
      const number = Math.floor(Math.random() * 1000);
      window.location = `/generate-report/${number}`;
    }
  }, [formState?.report]);

  if (!regions.length) {
    return <></>;
  } else {
    return (
      <>
        <div
          className={`md:min-h-screen ${
            window?.location?.href.includes("generate-report/")
              ? "w-auto"
              : "w-screen min-w-screen"
          } bg-white `}
        >
          <form
            action={formAction}
            className={`bg-white py-8 px-4 h-screen  shadow-lg  sticky top-0 ${
              window?.location?.href.includes("generate-report/")
                ? "w-auto"
                : "w-screen "
            } bg-white `}
          >
            <h2 className="text-2xl font-bold mb-6">Generate report</h2>

            <div className="mb-4">
              <label className="block text-gray-700">Region</label>
              <select
                name="region"
                className="w-full mt-1 p-2 border rounded-lg"
              >
                {regions?.map((region, i) => (
                  <option key={i}>{region}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Product</label>
              <select
                name="product"
                className="w-full mt-1 p-2 border rounded-lg"
              >
                {products.map((product, i) => (
                  <option key={i}>{product}</option>
                ))}
              </select>
            </div>
            <fieldset className="mb-4">
              <legend className="text-gray-700">Value Chain Stage</legend>
              {valuesChainStage.map((stage) => (
                <div key={stage} className="flex items-center mt-2">
                  <input type="checkbox" name={stage} className="mr-2" />
                  <label className="text-gray-700 capitalize">{stage}</label>
                </div>
              ))}
            </fieldset>
            <div className="mb-4">
              <label className="block text-gray-700">First Use Mode</label>
              <select
                name="firstUseMode"
                className="w-full mt-1 p-2 border rounded-lg"
              >
                {firstUseModes.map((mode, i) => (
                  <option key={i}>{mode}</option>
                ))}
              </select>
            </div>
            <fieldset className="mb-4">
              <legend className="text-gray-700">Contribution</legend>
              {["input", "valueAdded"].map((contrib) => (
                <div key={contrib} className="flex items-center mt-2">
                  <input type="checkbox" name={contrib} className="mr-2" />
                  <label className="text-gray-700 capitalize">{contrib}</label>
                </div>
              ))}
            </fieldset>
            <fieldset className="mb-4">
              <legend className="text-gray-700">Effect</legend>
              {[
                "directEffect",
                "firstRound",
                "industrialSupport",
                "incomeEffect",
              ].map((eff) => (
                <div key={eff} className="flex items-center mt-2">
                  <input type="checkbox" name={eff} className="mr-2" />
                  <label className="text-gray-700 capitalize">{eff}</label>
                </div>
              ))}
            </fieldset>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Generate
            </button>
          </form>
        </div>
      </>
    );
  }
}
