"use server";

import { msrService, oecdService, Region } from "@/server/services";
import { FirstUseMode, UUID } from "@/server/holistic-approach/io.types";
import { type Report, reportService } from "@/server/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ComoditiesListType, ProductsListType, RegionsListType } from "./types";
import { FormDataType } from "./page";
import { RegionalReport } from "@/server/holistic-approach/report.types";

type ReportData = {
  report: Report | RegionalReport[] | null;
  message?: string;
};
export async function getDataFormFromServer() {
  const res = await Promise.all([
    oecdService.getRegions('oecd.wiebe_2008-2015'),
    msrService.getProducts('msr.cobalt-insitute_2019'),
  ]);

  revalidatePath("/");
  return {
    regions: ["Global", ...res[0].map((r) => r.Region)],
    products: ["All products", ...res[1].map((p) => p.Product)],
  };
}

export async function formServerAction(
  prevState: FormDataType,
  formData: FormDataType
): Promise<ReportData> {
  const schema = z.object({
    region: z.enum(["Europe", "North America", "Global"]).default("Global"),
    product: z.enum(["All products", "Fine powder"]).default("All products"),
    valueChainStage: z
      .object({
        mining: z.boolean().default(true),
        refining: z.boolean().default(true),
        firstUse: z.boolean().default(true),
        endUse: z.boolean().default(true),
        recycling: z.boolean().default(true),
      })
      .optional(),
    firstUseMode: z
      .enum(["ISIC sectorial analysis", "Representative Companies", "Average"])
      .default("ISIC sectorial analysis")
      .optional(),
    contribution: z
      .object({
        input: z.boolean().default(true),
        valueAdded: z.boolean().default(true),
      })
      .optional(),
    effect: z
      .object({
        directEffect: z.boolean().default(true),
        firstRound: z.boolean().default(true),
        industrialSupport: z.boolean().default(true),
        incomeEffect: z.boolean().default(true),
      })
      .optional(),
  });

  const formattedData = {
    region: formData.get("region"),
    product: formData.get("product"),
    valueChainStage: {
      mining: formData.get("mining") === "on",
      refining: formData.get("refining") === "on",
      firstUse: formData.get("firstUse") === "on",
      endUse: formData.get("endUse") === "on",
      recycling: formData.get("recycling") === "on",
    },
    firstUseMode: formData.get("firstUseMode"),
    contribution: {
      input: formData.get("input") === "on",
      valueAdded: formData.get("valueAdded") === "on",
    },
    effect: {
      directEffect: formData.get("directEffect") === "on",
      firstRound: formData.get("firstRound") === "on",
      industrialSupport: formData.get("industrialSupport") === "on",
      incomeEffect: formData.get("incomeEffect") === "on",
    },
  };
  const parse = schema.safeParse(formattedData);

  if (!parse.success) {
    return { report: null, message: "Failed to submit the form" };
  }

  const data = parse.data;

  try {
    const reportData = await reportService.generateReport(data);
    revalidatePath("/");
    if (reportData)
      return {
        report: Array.isArray(reportData) ? reportData : [reportData],
        message: "",
      };
  } catch (e) {}
  return {
    report: null,
    message: "Failed to submit the form",
  };
}

// export async function selectComodityAction(
//   prevState: RegionsListType,
//   formData: FormData
// ): Promise<RegionsListType> {
//   const schema = z.object({
//     selectedComodity: z.string().min(1),
//   });
//   const parse = schema.safeParse({
//     selectedComodity: formData.get("commodity_list"),
//   });

//   if (!parse.success) {
//     return { regionList: null, message: "Failed to select comodity" };
//   }

//   const data = parse.data;
//   // console.log({ data });

//   try {
//     // It's not the commodity, OECD depends only on the year and its calculation on the region
//     // const regions = await getRegionsFrom(data.selectedComodity);
//     const regions = await oecdService.getRegions('src-OECD_auth-Wiebe_from-2008_to-2015');

//     revalidatePath("/");
//     return { regionList: regions, message: null };
//   } catch (e) {}
//   return {
//     regionList: null,
//     message: "Failed to select the commodity",
//   };
// }
// export async function selectRegionAction(
//   prevState: ProductsListType,
//   formData: FormData
// ): Promise<ProductsListType> {
//   // console.log(formData.getAll("regions"));
//   const schema = z.object({
//     selectedRegions: z.array(z.string()),
//   });
//   const parse = schema.safeParse({
//     selectedRegions: formData.getAll("regions"),
//   });

//   if (!parse.success) {
//     return { productsList: null, message: "Failed to select regions" };
//   }

//   const data = parse.data;
//   // console.log({ data });

//   try {
//     const products = await msrService.getProducts("");

//     revalidatePath("/");
//     return { productsList: products, message: null };
//   } catch (e) {}
//   return {
//     productsList: null,
//     message: "Failed to select the commodity",
//   };
// }
