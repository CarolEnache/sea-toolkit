"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter, usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { Product, Region } from "@/server/services";
import {
  formServerAction,
  getDataFormFromServer,
} from "@/app/generate-report/actions";
import { EconomicFactors } from "@/server/holistic-approach/report.types";

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

const economicFactors = [
  "directEffect",
  "firstRound",
  "industrialSupport",
  "incomeEffect",
];
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

const mdScreen = 768;

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

export default function GenerateReport() {
  const router = useRouter();

  const [formState, formAction] = useFormState(formServerAction, initialState);
  const [regions, setRegions] = useState<Region["Region"][]>([]);
  const [products, setProducts] = useState<Product["Product"][]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const isReportDetailPage = usePathname().includes("generate-report/");

  // to automaticly close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > mdScreen) {
        setShowMenu(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      setShowMenu(false);
      window.localStorage.setItem("report", JSON.stringify(formState.report));
      const number = Math.floor(Math.random() * 1000);
      router.push(`/generate-report/${number}`);
    }
  }, [formState.report, router]);

  return (
    <>
      <div
        className={`md:min-h-screen  ${
          isReportDetailPage
            ? `w-auto md:block ${
                showMenu ? "fixed top-0 left-0 w-full h-full z-30 " : "hidden"
              } `
            : "w-screen min-w-screen"
        } bg-white `}
      >
        <form
          id="formator"
          action={formAction}
          className={`bg-white py-8 px-4 h-screen  shadow-lg  sticky top-0 ${
            isReportDetailPage ? "w-auto " : "w-screen "
          }  `}
        >
          <h2 className="text-2xl font-bold mb-6 text-secondary">
            Generate report
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700">Region</label>
            <select name="region" className="w-full mt-1 p-2 border rounded-lg">
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
                <input
                  type="checkbox"
                  name={stage}
                  className="mr-2 accent-primary"
                />
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
                <input
                  type="checkbox"
                  name={contrib}
                  className="mr-2 accent-primary "
                />
                <label className="text-gray-700 capitalize">{contrib}</label>
              </div>
            ))}
          </fieldset>
          <fieldset className="mb-4">
            <legend className="text-gray-700">Effect</legend>
            {economicFactors.map((eff) => (
              <div key={eff} className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name={eff}
                  className="mr-2 accent-primary"
                />
                <label className="text-gray-700 capitalize">{eff}</label>
              </div>
            ))}
          </fieldset>

          <button
            type="submit"
            className="w-full py-2 bg-secondary active:scale-95 text-white font-bold rounded-lg hover:bg-primary transition duration-300"
          >
            Generate
          </button>
        </form>
      </div>

      {/* mobile toggle button show menu */}
      <button
        className={`${
          isReportDetailPage
            ? "fixed top-8 right-8 md:hidden block z-50 "
            : "hidden"
        }`}
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? (
          <svg
            className="w-8 h-8 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>
    </>
  );
}
