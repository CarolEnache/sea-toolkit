"use client";

import MyChart from "@/components/testCharts";

import React, { useState, useEffect } from "react";

const ReportData = ({ params }) => {
  const { id } = params;
  //   console.log(id);
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    // if (id) {
    //   // Simulate fetching report data based on the id
    //   fetchReportData(id).then((data) => {
    //     setReport(data);
    //     setLoading(false);
    //   });
    // }
    const data = window?.localStorage?.getItem("report") || "";

    if (data) {
      const formatedData = JSON.parse(data);
      const extractedKeys = Object.entries(formatedData).map(([key, _]) => key);

      setKeys((value) => (value = extractedKeys.filter((a) => a !== "Region")));
      setReport((value) => (value = formatedData));
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

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>No report found for ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-8">Region: {report.Region}</h2>

        <div className="grid grid-cols-1 gap-4 mb-4 w-full ">
          {keys.map((key, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg min-h-full w-full"
            >
              <h3 className="text-xl font-bold mb-4">{key}</h3>
              <MyChart data={report} cat={key} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simulate fetching report data
async function fetchReportData(id) {
  // Replace with your actual data fetching logic
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, details: `Details for report ${id}` });
    }, 2000); // Simulate a 2 seconds delay for fetching data
  });
}

export default ReportData;
