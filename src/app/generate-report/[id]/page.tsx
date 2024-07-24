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

const ReportData = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [selectedRegion, setSelectedRegion] = useState("");
  const [reports, setReports] = useState<RegionalReport[]>([]);
  const [economicParametersKey, setEconomicParametersKey] = useState<
    EconomicParameterValues[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSelectedRegion = (region) => {
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
    <div className="min-h-screen bg-tertiary/50 p-10">
      <div className="container mx-auto">
        {reports.length > 0 && (
          <>
            {reports
              .filter((report) => report.Region === selectedRegion)
              .map((report, i) => (
                <div key={i}>
                  {/* <h2 className="text-4xl font-bold mb-8 ">
                    Region: {report.Region}
                  </h2> */}

                  <div className={`flex flex-wrap flex-1 gap-4 mb-6`}>
                    {reports.map((report, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectedRegion(report.Region)}
                        className={` flex items-center justify-center px-6 py-3 font-medium  transition duration-300 ease-out border-2  rounded-lg shadow-md focus:outline-none ${
                          selectedRegion === report.Region
                            ? "bg-secondary text-tertiary border-secondary/70"
                            : "bg-white text-primary border-tertiary"
                        } hover:bg-secondary hover:text-tertiary hover:border-secondary/70`}
                      >
                        {report.Region}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2  gap-4 mb-4 w-full ">
                    {economicParametersKey.map((economicParamKey, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-lg min-h-full w-full"
                      >
                        <h3 className="text-2xl font-bold mb-4">
                          {economicParamKey}
                        </h3>
                        <ReportChart
                          report={report}
                          economicParamKey={economicParamKey}
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
