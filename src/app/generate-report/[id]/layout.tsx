"use client";

import GenerateReport from "@/components/Form-generate-report";

export default function GenerateReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col bg-tertiary/50 md:flex-row">
      <GenerateReport />

      <main className="w-full"> {children}</main>
    </div>
  );
}
