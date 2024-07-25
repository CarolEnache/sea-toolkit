'use client'

import GenerateReport from "@/components/form-generate-report";
import { createContext, useState } from "react";

export const LayoutContext = createContext(null);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const [data, setData] = useState(null);
  // const res = await getDataFormFromServer();

  // if (!res) {
  // 	return <div>loading...</div>
  // }

  // const handleSubmit = async (
  //   event:
  //     | { preventDefault: () => void; target: HTMLFormElement | undefined }
  //     | undefined
  // ) => {
  //   "use server";
  //   // event?.preventDefault();
  //   const formData = new FormData(event?.target);
  //   // event.preventDefault();
  //   const res = await formServerAction(formData, initialState);
  //   console.log({ res });
  // };

  return (
    <div className="flex flex-col  md:flex-row  bg-gray-100">
      <LayoutContext.Provider value={{ data, setData }}>
        <GenerateReport />

        <main className="w-full"> {children}</main>
      </LayoutContext.Provider>
    </div>
  );
}
