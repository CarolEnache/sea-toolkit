"use client";

import ReportChart from "@/components/reportChart";

import React, { useState, useEffect } from "react";
import {
  EconomicParameters,
  RegionalReport,
} from "@/server/holistic-approach/report.types";

type EconomicParametersWithoutRegion = Exclude<
  keyof typeof EconomicParameters,
  "region"
>;

export type EconomicParameterValues =
  (typeof EconomicParameters)[EconomicParametersWithoutRegion];

const chartColors = { LOW: "#F1FAFF", BASE: "#53709D", HIGH: "#012d49" };

const ReportData = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [selectedRegion, setSelectedRegion] = useState("");
  const [reports, setReports] = useState<RegionalReport[]>([]);
  const [economicParametersKey, setEconomicParametersKey] = useState<
    EconomicParameterValues[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSelectedRegion = (region: string) => {
    setSelectedRegion(region);
  };
  useEffect(() => {
    setLoading(true);
    const data = window?.localStorage?.getItem("report") || "";

    if (data) {
      const formatedData = JSON.parse(data);

      const extractedKeys = Object.entries(formatedData[0]).map(
        ([key, _]) => key
      ) as EconomicParameters[];

      setEconomicParametersKey(extractedKeys.filter((a) => a !== "Region"));
      setSelectedRegion(formatedData[0].Region);
      setReports(formatedData);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tertiary/50 p-6 ">
      <div className="container mx-auto ">
        {reports.length > 0 && (
          <>
            {reports
              .filter((report) => report.Region === selectedRegion)
              .map((report, i) => (
                <div key={i}>
                  {/* TOP CONTENT  */}
                  <div className="flex items-center flex-wrap gap-4 mb-6">
                    {/* BUTTON TAB REGION  */}
                    {reports.map((report, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectedRegion(report.Region)}
                        className={`flex items-center justify-center px-6 py-3 font-medium  transition duration-300 ease-out border-2  rounded-lg shadow-md focus:outline-none hover:bg-secondary hover:text-tertiary hover:border-secondary/70 ${
                          selectedRegion === report.Region
                            ? "bg-secondary text-tertiary border-secondary/70"
                            : "bg-white text-primary border-tertiary active:scale-95"
                        } `}
                      >
                        {report.Region}
                      </button>
                    ))}

                    {/* LEGENDS  */}
                    <ul className="hidden md:flex items-center justify-center h-full gap-2.5 bg-white p-3.5 rounded ">
                      {Object.entries(chartColors).map(([key, color], i) => (
                        <li key={i} className="flex items-center gap-1">
                          <div
                            className="w-5 h-5 border rounded border-secondary"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span>{key}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* each chartReport  */}
                  <div className="grid grid-cols-1 xl:grid-cols-2  gap-4 mb-4 w-full">
                    {economicParametersKey.map((economicParamKey, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-lg min-h-full w-full"
                      >
                        <ReportChart
                          report={report}
                          economicParamKey={economicParamKey}
                          chartColors={chartColors}
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
