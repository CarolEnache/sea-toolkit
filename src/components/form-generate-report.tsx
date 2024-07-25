"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter, usePathname } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import {
  formServerAction,
  getDataFormFromServer,
} from "@/app/generate-report/actions";
import { Checkbox } from "@nextui-org/react";
import { Region } from "@/server/services/ts/oecd";
import { Product } from "@/server/services/ts/msr";
import { reportService } from "@/server/services";

// import { Checkbox } from "@next@/app/generate-report/[id]/layout

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
  const { pending, data, method, action } = useFormStatus();
  // NEED TO FIX THE TYPES
  const [formState, formAction] = useFormState(formServerAction, initialState);

  const [regions, setRegions] = useState<Region["Region"][]>([]);
  const [products, setProducts] = useState<Product["Product"][]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const isReportDetailPage = usePathname().includes("generate-report/");
  const formRef = useRef(null);

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
    if (formState?.reportId) {
      setShowMenu(false);
      router.push(`/generate-report/${formState.reportId}`);
    }
  }, [formState.reportId, router]);

  return (
    <>
      <div
        className={`md:min-h-screen flex justify-center items-center bg-white ${
          isReportDetailPage
            ? `md:w-[250px] lg:w-[300px] xl:w-[350px] min-w-[250px] w-auto md:block ${
                showMenu ? "fixed top-0 left-0 w-full h-full z-30 " : "hidden"
              } `
            : "w-screen min-w-screen"
        }  `}
      >
        <form
          ref={formRef}
          action={formAction}
          className={`flex flex-col justify-between gap-8 py-6   h-screen  shadow-lg  sticky top-0 w-full ${
            !isReportDetailPage && "md:max-w-2xl"
          }  `}
        >
          <h2 className="text-2xl font-bold  text-gray-700 px-4">
            Generate report
          </h2>

          <div className="max-h-full customScrollbar overflow-y-auto px-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold  mb-1">
                Region
              </label>

              {!regions.length ? (
                <div className="w-full animate-pulse bg-primary/5 border h-10 rounded-lg" />
              ) : (
                <select name="region" className="selectForm">
                  {regions.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold  mb-1">
                Product
              </label>

              {!products.length ? (
                <div className="w-full animate-pulse bg-primary/5 border h-10 rounded-lg" />
              ) : (
                <select name="product" className="selectForm">
                  {products.map((product) => (
                    <option key={product}>{product}</option>
                  ))}
                </select>
              )}
            </div>

            <fieldset className="mb-4">
              <legend className="text-gray-700 font-semibold">
                Value Chain Stage
              </legend>

              {valuesChainStage.map((stage) => (
                <div key={stage} className="flex items-center mt-2">
                  <Checkbox
                    color="secondary"
                    name={stage}
                    size="sm"
                    key={stage}
                    defaultSelected
                  >
                    <p className="text-gray-700 capitalize text-base">
                      {stage}
                    </p>
                  </Checkbox>
                </div>
              ))}
            </fieldset>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold  mb-1">
                First Use Mode
              </label>

              {!firstUseModes.length ? (
                <div className="w-full animate-pulse bg-primary/5 border h-10 rounded-lg" />
              ) : (
                <select name="firstUseMode" className="selectForm">
                  {firstUseModes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              )}
            </div>

            <fieldset className="mb-4">
              <legend className="text-gray-700 font-semibold">Effect</legend>

              {["input", "valueAdded"].map((stage) => (
                <div key={stage} className="flex items-center mt-2">
                  <Checkbox
                    color="secondary"
                    name={stage}
                    size="sm"
                    key={stage}
                    defaultSelected
                  >
                    <p className="text-gray-700 capitalize text-base">
                      {stage}
                    </p>
                  </Checkbox>
                </div>
              ))}
            </fieldset>

            <fieldset className="mb-4">
              <legend className="text-gray-700 font-semibold">Effect</legend>
              {economicFactors.map((stage) => (
                <div key={stage} className="flex items-center mt-2">
                  <Checkbox
                    color="secondary"
                    name={stage}
                    size="sm"
                    key={stage}
                    defaultSelected
                  >
                    <p className="text-gray-700 capitalize text-base">
                      {stage}
                    </p>
                  </Checkbox>
                </div>
              ))}
            </fieldset>
          </div>
          <div className="px-4">
            <button
              type="submit"
              disabled={pending}
              className="w-full py-2  bg-secondary active:scale-95 text-white font-bold rounded-lg hover:bg-primary transition duration-300"
            >
              {pending ? "Sending..." : "Generate"}
            </button>
          </div>
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
