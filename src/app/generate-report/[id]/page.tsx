"use client";

import ReportChart from "@/components/reportChart";

import React, {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useTransition,
} from "react";
import {
  EconomicParameters,
  ForecastingGroup,
  RegionalReport,
} from "@/server/holistic-approach/report.types";
import { getReportDataAction } from "../actions";

type EconomicParametersWithoutRegion = Exclude<
  keyof typeof EconomicParameters,
  "region"
>;

export type EconomicParameterValues =
  (typeof EconomicParameters)[EconomicParametersWithoutRegion];

export type HandleToggleDataArrayProps<T> = (
  value: T,
  setState: Dispatch<SetStateAction<T[]>>
) => void;

const chartColors = { LOW: "#F1FAFF", BASE: "#53709D", HIGH: "#012d49" };
export type ForecastingGroupKey = keyof typeof ForecastingGroup;
const keysForecastingGroup = Object.keys(chartColors) as ForecastingGroupKey[];

const ReportData = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedForecastingGroup, setSelectedForecastingGroup] =
    useState(keysForecastingGroup);
  const [reports, setReports] = useState<RegionalReport[]>([]);
  const [economicParametersKey, setEconomicParametersKey] = useState<
    EconomicParameterValues[]
  >([]);
  const [loading, startTransition] = useTransition();

  const updatereportData = async () => {
    startTransition(async () => {
      const res = await getReportDataAction(id);
      const extractedKeys = Object.entries(res[0]).map(
        ([key, _]) => key
      ) as EconomicParameters[];

      setEconomicParametersKey(extractedKeys.filter((a) => a !== "Region"));
      setSelectedRegion(res[0].Region);
      setReports(res);
    });
  };

  useEffect(() => {
    updatereportData();
  }, []);

  const handleToggleDataArray: HandleToggleDataArrayProps<any> = (
    value,
    setState
  ) => {
    setState((prevStages) => {
      if (!prevStages.includes(value)) {
        return [...prevStages, value];
      } else {
        return prevStages.filter((va) => va !== value);
      }
    });
  };

  const handleSelectedRegion = (region: string) => {
    setSelectedRegion(region);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="w-full mx-auto p-6">
        {reports.length > 0 && Array.isArray(reports) && (
          <>
            {reports
              .filter((report) => report.Region === selectedRegion)
              .map((report, i) => (
                <div key={i}>
                  {/* TOP CONTENT  */}
                  <div
                    className={`flex flex-col md:flex-row justify-between gap-3 w-full mb-6 z-10`}
                  >
                    <div className="flex items-center flex-wrap gap-3 max-w-[90%] md:max-w-full">
                      {/* BUTTON TAB REGION  */}
                      {reports.map((report, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectedRegion(report.Region)}
                          className={`px-6 py-3 font-medium transition duration-300 ease-out border-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 hover:bg-secondary hover:text-tertiary hover:border-secondary/70 ${
                            selectedRegion === report.Region
                              ? "bg-secondary text-tertiary border-secondary/70 ring-2 ring-primary ring-opacity-50"
                              : "bg-white text-primary border-tertiary active:scale-95"
                          } `}
                        >
                          {report.Region}
                        </button>
                      ))}
                    </div>
                    {/* LEGENDS  */}
                    <div className="flex items-center justify-center  border-2 border-tertiary gap-4 bg-white px-6 py-3 h-[52px] rounded-lg shadow-md">
                      {Object.entries(chartColors).map(([key, color], i) => (
                        <button
                          onClick={() =>
                            handleToggleDataArray(
                              key,
                              setSelectedForecastingGroup
                            )
                          }
                          key={i}
                          className="flex items-center gap-1"
                        >
                          <div
                            className={`w-6 h-6 border rounded-full border-gray-300 `}
                            style={{ backgroundColor: color }}
                          ></div>
                          <span
                            className={`${
                              !selectedForecastingGroup.includes(
                                key as ForecastingGroupKey
                              ) && "line-through text-gray-400"
                            } font-medium text-gray-700`}
                          >
                            {key}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* each chartReport  */}
                  <div className="grid grid-cols-1 xl:grid-cols-2   gap-4 mb-4 w-full">
                    {economicParametersKey.map((economicParamKey, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-lg min-h-full w-full"
                      >
                        <ReportChart
                          report={report}
                          economicParamKey={economicParamKey}
                          chartColors={chartColors}
                          keysForecastingGroup={keysForecastingGroup}
                          selectedForecastingGroup={selectedForecastingGroup}
                          handleToggleDataArray={handleToggleDataArray}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportData;
