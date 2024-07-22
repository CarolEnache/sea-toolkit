"use client";

import GenerateReport from "@/components/form-generate-report";
import { formServerAction, getDataFormFromServer } from "./actions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col  md:flex-row  bg-gray-100">
      <GenerateReport
        formServerAction={formServerAction}
        getDataFormFromServer={getDataFormFromServer}
      />

      <main className="w-full">{children}</main>
    </div>
  );
}
