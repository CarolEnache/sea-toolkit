"use client";

import GenerateReport from "@/components/form-generate-report";

import React from "react";
import ReportData from "@/components/report-data";
import { GenerateReportContextProvider } from "@/contexts/generate-report";

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
