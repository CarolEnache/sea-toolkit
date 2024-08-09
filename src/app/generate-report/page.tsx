"use client";

import GenerateReport from "@/components/Form-generate-report";
import { GenerateReportContextProvider } from "@/app/Context/GenerateReportContext";
import React from "react";
import ReportData from "@/components/Report_data";

function FormPage() {
  return (
    <GenerateReportContextProvider>
      <div className="flex flex-col  bg-tertiary/50 md:flex-row">
        <GenerateReport />
        <ReportData />
      </div>
    </GenerateReportContextProvider>
  );
}

export default FormPage;
