"use client";

import { useFormStatus } from "react-dom";
import { FormEvent, useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/react";
import type { Region } from "@/server/services/ts/oecd";
import type { Product } from "@/server/services/ts/msr";

import { formServerAction, getDataFormFromServer } from "./actions";
import { FormDataType } from "@/types/front/report";
import { useGenerateReportContext } from "@/contexts/generate-report";

const firstUseModes = [
  "ISIC sectorial analysis",
  "Representative Companies",
  "Average",
];

const mdScreen = 768;

const initialState: FormDataType = {
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
  const { reportId, setReportId } = useGenerateReportContext();
  const [regions, setRegions] = useState<Region["Region"][]>([]);
  const [products, setProducts] = useState<Product["Product"][]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormData = async () => {
    const res = await getDataFormFromServer();
    setRegions(res.regions);
    setProducts(res.products);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { reportId, message } = await formServerAction(formData);
    if (reportId) {
      if (errorMessage) setErrorMessage("");
      if (showMenu) setShowMenu(false);
      setReportId(reportId);
    } else {
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    handleFormData();

    // to automaticly close mobile menu
    const handleResize = () => {
      if (window.innerWidth > mdScreen) {
        setShowMenu(false);
      }
    };

    window?.addEventListener("resize", handleResize);

    return () => {
      window?.removeEventListener("resize", handleResize);
      window.localStorage.removeItem("reportId");
    };
  }, []);

  return (
    <>
      <div
        className={`md:max-h-screen min-h-screen flex justify-center items-center sticky top-0 bg-tertiary/50 ${
          reportId
            ? `md:w-[250px] lg:w-[300px] xl:w-[350px] min-w-[250px] w-auto md:block ${
                showMenu ? "fixed top-0 left-0 w-full h-screen z-30 " : "hidden"
              } `
            : "w-screen min-w-screen h-screen"
        }  `}
      >
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col justify-between gap-6 py-6   h-full bg-white  shadow-lg   w-full ${
            !reportId && "md:max-w-2xl"
          }  `}
        >
          <h2 className="text-2xl font-bold  text-gray-700 px-4">
            Generate report
          </h2>

          <div className="customScrollbar overflow-y-auto px-4">
            <div className="mb-2.5">
              <label className="block text-gray-700 font-semibold mb-1">
                Region
              </label>

              {!regions.length ? (
                <div className="w-full animate-pulse bg-primary/5 border h-10 rounded-lg" />
              ) : (
                <select
                  defaultValue={initialState.region}
                  name="region"
                  className="selectForm"
                >
                  {regions.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="mb-2.5">
              <label className="block text-gray-700 font-semibold mb-1">
                Product
              </label>

              {!products.length ? (
                <div className="w-full animate-pulse bg-primary/5 border h-10 rounded-lg" />
              ) : (
                <select name="product" className="selectForm">
                  {products.map((product) => (
                    <option defaultValue={initialState.product} key={product}>
                      {product}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {initialState.valueChainStage && (
              <fieldset className="mb-2.5">
                <legend className="text-gray-700 font-semibold">
                  Value Chain Stage
                </legend>

                {Object.entries(initialState.valueChainStage).map(
                  ([key, value]) => (
                    <div key={key} className="flex items-center mt-1">
                      <Checkbox
                        color="secondary"
                        name={key}
                        size="sm"
                        key={key}
                        defaultSelected={value}
                      >
                        <p className="text-gray-700 capitalize text-base">
                          {key}
                        </p>
                      </Checkbox>
                    </div>
                  )
                )}
              </fieldset>
            )}
            <div className="mb-2.5">
              <label className="block text-gray-700 font-semibold mb-1">
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
            {initialState.contribution && (
              <fieldset className="mb-2.5">
                <legend className="text-gray-700 font-semibold">Effect</legend>

                {Object.entries(initialState.contribution).map(
                  ([key, value]) => (
                    <div key={key} className="flex items-center mt-1">
                      <Checkbox
                        color="secondary"
                        name={key}
                        size="sm"
                        key={key}
                        defaultSelected={value}
                      >
                        <p className="text-gray-700 capitalize text-base">
                          {key}
                        </p>
                      </Checkbox>
                    </div>
                  )
                )}
              </fieldset>
            )}
            {initialState.effect && (
              <fieldset className="mb-2.5">
                <legend className="text-gray-700 font-semibold">Effect</legend>
                {Object.entries(initialState.effect).map(([key, value]) => (
                  <div key={key} className="flex items-center mt-1">
                    <Checkbox
                      color="secondary"
                      name={key}
                      size="sm"
                      key={key}
                      defaultSelected={value}
                    >
                      <p className="text-gray-700 capitalize text-base">
                        {key}
                      </p>
                    </Checkbox>
                  </div>
                ))}
              </fieldset>
            )}
          </div>

          <div className="px-4">
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}
            <SubmitButton />
          </div>
        </form>
      </div>

      {/* mobile toggle button show menu */}
      <button
        className={`${
          reportId ? "fixed top-8 right-8 md:hidden block z-50 " : "hidden"
        }`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <svg
          className="w-8 h-8 text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {showMenu ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="w-full py-2  bg-secondary active:scale-95 text-white font-bold rounded-lg hover:bg-primary transition duration-300"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center ">
          <div className="relative">
            <div className="h-6 w-6 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-6 w-6 rounded-full border-t-8 border-b-8 border-tertiary animate-spin"></div>
          </div>
        </div>
      ) : (
        "Generate"
      )}
    </button>
  );
}
