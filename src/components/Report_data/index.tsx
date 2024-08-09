"use client";

import ReportChart from "@/components/Report-chart";

import React, {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useTransition,
} from "react";
import {
  EconomicFactorsValuesEnum,
  EconomicParameterValuesEnum,
  FactorsByStageReport,
  ForecastingGroup,
  ForecastingGroupKey,
  ManufacturingValuesEnum,
  RegionalReport,
  YearRangeString,
} from "@/server/holistic-approach/report.types";
import { getReportDataAction } from "./actions";
import { useGenerateReportContext } from "@/contexts/GenerateReport";
import { HandleToggleDataArrayProps } from "@/types/front/report";

const chartColors: { [key in keyof typeof ForecastingGroup]: string } = {
  LOW: "#F1FAFF",
  BASE: "#53709D",
  HIGH: "#012d49",
};

const keysForecastingGroup = Object.keys(chartColors) as ForecastingGroupKey[];

function ReportData({ reportId }: { reportId: string }) {
  const [indexChartFullScreen, setIndexChartFullScreen] = useState<
    null | number
  >(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedForecastingGroup, setSelectedForecastingGroup] =
    useState(keysForecastingGroup);
  const [reports, setReports] = useState<RegionalReport[]>([]);
  const [economicParametersKey, setEconomicParametersKey] = useState<
    EconomicParameterValuesEnum[]
  >([]);
  const [dates, setDates] = useState<YearRangeString[]>([]);
  const [isLoading, startLoading] = useTransition();
  const [manufacturingStagesKey, setManufacturingStagesKey] = useState<
    ManufacturingValuesEnum[]
  >([]);

  useEffect(() => {
    const updateReportData = async () => {
      startLoading(async () => {
        const res = await getReportDataAction(reportId);

        const firstReport = res[0];
        const filteredFirstReport = Object.entries(firstReport).filter(
          ([key, value]) => key !== "Region"
        ) as [EconomicParameterValuesEnum, FactorsByStageReport][];
        const extractedKeys = filteredFirstReport.map(
          ([key, _]) => key
        ) as EconomicParameterValuesEnum[];

        setEconomicParametersKey(extractedKeys);
        setSelectedRegion(firstReport.Region);
        setReports(res);

        // GET DATES && manufacturingStageKeys DYNAMICLY (VERY STRANGE)
        const economicFactors = Object.values(
          filteredFirstReport[0][1]
        )[0] as RegionalReport["Employment"]["BASE"];
        const manufacturingStages = Object.values(
          economicFactors
        )[0] as RegionalReport["Employment"]["BASE"]["Change"];
        const data = Object.values(
          manufacturingStages
        )[0] as RegionalReport["Employment"]["BASE"]["Change"]["Direct Applications"];

        const dates = Object.keys(data) as YearRangeString[];

        setDates(dates);

        const manufacturingStageValuesEnum = Object.keys(
          manufacturingStages
        ) as ManufacturingValuesEnum[];
        setManufacturingStagesKey(manufacturingStageValuesEnum);
      });
    };
    updateReportData();
  }, [reportId]);

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

  const returnEconomicFactorsValues = (
    report: RegionalReport,
    economicParamKey: EconomicParameterValuesEnum,
    level: ForecastingGroupKey
  ): EconomicFactorsValuesEnum[] => {
    const economicFactorsValues = Object.keys(
      report[economicParamKey][level]
    ) as EconomicFactorsValuesEnum[];
    return economicFactorsValues;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full ">
        <div className="relative">
          <div className="h-28 w-28 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-28 w-28 rounded-full border-t-8 border-b-8 border-primary animate-spin"></div>
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
                    {/* LEGENDS TOGGLE BUTTON  */}
                    <div className="flex items-center md:z-[60] justify-center  border-2 border-tertiary gap-4 bg-white px-6 py-3 h-[52px] rounded-lg shadow-md">
                      {Object.entries(chartColors).map(([key, color]) => (
                        <button
                          onClick={() =>
                            handleToggleDataArray(
                              key,
                              setSelectedForecastingGroup
                            )
                          }
                          key={color}
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

                  {/* each ChartReport and Table */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4 w-full">
                    {economicParametersKey.map(
                      (economicParamKey, chartIndex) => (
                        <div key={chartIndex}>
                          <div
                            className={`bg-white p-4 rounded-lg shadow-lg min-h-full w-full ${
                              indexChartFullScreen === chartIndex &&
                              "fixed top-0 left-0 h-full w-screen z-50 pt-24 overflow-y-auto"
                            }`}
                          >
                            <ReportChart
                              report={report}
                              economicParamKey={economicParamKey}
                              chartColors={chartColors}
                              keysForecastingGroup={keysForecastingGroup}
                              selectedForecastingGroup={
                                selectedForecastingGroup
                              }
                              handleToggleDataArray={handleToggleDataArray}
                              index={chartIndex}
                              indexChartFullScreen={indexChartFullScreen}
                              setIndexChartFullScreen={setIndexChartFullScreen}
                              dates={dates}
                            />

                            {/* TABLES  */}
                            <div
                              className={`${
                                indexChartFullScreen === chartIndex
                                  ? "flex flex-col gap-6 w-full text-xs mt-36"
                                  : "hidden"
                              }`}
                            >
                              {keysForecastingGroup.map((level) => (
                                <div
                                  className="flex overflow-x-auto customScrollbar rounded-lg  "
                                  key={level}
                                >
                                  <div className="flex flex-col  items-center justify-center shadow-lg ">
                                    <div
                                      style={{
                                        backgroundColor: chartColors[level],
                                      }}
                                      className="w-full  h-full font-semibold px-2 flex justify-center items-center"
                                    >
                                      <span className="p-2 py-3 w-12 border shadow-md rounded-full bg-white text-grey-700">
                                        {level}
                                      </span>
                                    </div>
                                    <ul
                                      key={i}
                                      className="flex bg-white flex-col   min-w-[150px]  justify-end text-start h-full "
                                    >
                                      {Object.keys(
                                        report[economicParamKey][level]
                                      ).map((category) => (
                                        <li
                                          className="py-2 font-semibold border-y pl-2"
                                          key={category}
                                        >
                                          {category}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* TABLES */}
                                  <div className="flex bg-white shadow-lg ">
                                    {manufacturingStagesKey.map(
                                      (manufactoryStage) => (
                                        <table
                                          key={manufactoryStage}
                                          className=" min-w-[200px] border-collapse"
                                        >
                                          <thead>
                                            <tr className="bg-gray-100">
                                              <th className="border px-4 py-2">
                                                {manufactoryStage}
                                              </th>
                                            </tr>
                                          </thead>

                                          <tbody>
                                            <tr>
                                              <td className="border px-4 py-2 flex">
                                                {dates.map((date, i) => (
                                                  <React.Fragment key={date}>
                                                    <span className="w-1/2 underline text-center font-semibold">
                                                      {date}
                                                    </span>{" "}
                                                    {i === 0 && " - "}
                                                  </React.Fragment>
                                                ))}
                                              </td>
                                            </tr>

                                            {returnEconomicFactorsValues(
                                              report,
                                              economicParamKey,
                                              level
                                            ).map((category) => (
                                              <tr key={category}>
                                                <td className="border px-4 py-2   flex">
                                                  {dates.map(
                                                    (date, dateIndex) => (
                                                      <React.Fragment
                                                        key={dateIndex}
                                                      >
                                                        <span
                                                          className={`w-1/2 text-center ${
                                                            category ===
                                                              "Change" &&
                                                            dateIndex !== 0 &&
                                                            "text-green-400 font-semibold"
                                                          } `}
                                                        >
                                                          {category ===
                                                            "Change" &&
                                                            dateIndex !== 0 &&
                                                            "+"}
                                                          {
                                                            report[
                                                              economicParamKey
                                                            ][level][category][
                                                              manufactoryStage
                                                            ][date]
                                                          }
                                                        </span>
                                                        {dateIndex === 0 &&
                                                          " - "}
                                                      </React.Fragment>
                                                    )
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function ReportDataRender() {
  const { reportId } = useGenerateReportContext();

  if (reportId) return <ReportData reportId={reportId} />;
}
