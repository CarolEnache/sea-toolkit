"use client";

import MyChart from "@/components/testCharts";

import React, { useState, useEffect } from "react";

const ReportData = ({ params }) => {
  const { id } = params;
  //   console.log(id);
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);

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
      console.log(formatedData);
      setReport((value) => (value = formatedData));
      console.log(report);
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
        <h2 className="text-4xl font-bold mb-8">Report for ID: {id}</h2>

        {/* Top row with 5 charts */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Line Chart 1</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Bar Chart 2</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Pie Chart 3</h3>
            <MyChart />
          </div>
        </div> */}

        {/* Middle row with 2 larger charts */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[400px]">
            <h3 className="text-xl font-bold mb-4">Polar Area Chart 4</h3>
            <MyChart data={report} />
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow-lg min-h-[400px]">
            <h3 className="text-xl font-bold mb-4">Scatter Chart 5</h3>
        
          </div> */}
        </div>

        {/* Mixed layout for the remaining charts */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Bubble Chart 8</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Mixed Chart 9</h3>
            <MyChart />
          </div>
        </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Line Chart 10</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Bar Chart 11</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Pie Chart 12</h3>
            <MyChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Doughnut Chart 13</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Radar Chart 14</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Polar Area Chart 15</h3>
            <MyChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-3 min-h-[400px]">
            <h3 className="text-xl font-bold mb-4">Scatter Chart 16</h3>
            <MyChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Bubble Chart 17</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2 min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Mixed Chart 18</h3>
            <MyChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
            <h3 className="text-xl font-bold mb-4">Line Chart 19</h3>
            <MyChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-5 min-h-[400px]">
            <h3 className="text-xl font-bold mb-4">Bar Chart 20</h3>
            <MyChart />
          </div>
        </div> */}
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
