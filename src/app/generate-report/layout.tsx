"use client";

import GenerateReport from "@/components/form-generate-report";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isReportDetailPage = usePathname().includes("generate-report/");
  return (
    <div
      className={`flex flex-col bg-tertiary/50 ${
        isReportDetailPage && "md:flex-row"
      } `}
    >
      <GenerateReport />

      <main className="w-full"> {children}</main>
    </div>
  );
}
