"use server";

import { msrService, oecdService } from "@/server/services";
import { FirstUseMode, UUID } from "@/server/holistic-approach/io.types";
import { generateReport } from "@/server/holistic-approach/report-output";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ComoditiesListType, ProductsListType, RegionsListType } from "./types";

export const testAction = async () => {
  return JSON.parse(JSON.stringify([]));
};

const DUMMY_COMODITIES_LIST = {
  commodityList: ["Cobalt", "Nickel", "Copper", "Aluminium"],
  valueChainStage: [
    "Mining",
    "Smelting/Refining",
    "First use",
    "End use",
    "Recycling",
  ],
  message: null,
};

const getDummyComotidiesFrom = (): Promise<ComoditiesListType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(DUMMY_COMODITIES_LIST);
    });
  });
};

export async function selectComodityGroupAction(
  prevState: ComoditiesListType,
  formData: FormData
): Promise<ComoditiesListType> {
  const schema = z.object({
    selectedComodityGroup: z.string().min(1),
  });
  const parse = schema.safeParse({
    selectedComodityGroup: formData.get("commodity_group"),
  });

  if (!parse.success) {
    return { commodityList: null, message: "Failed to create comodity", valueChainStage: null };
  }

  const data = parse.data;
  // console.log({ data });

  try {
    const comodities = await getDummyComotidiesFrom();

    revalidatePath("/");
    return comodities;
  } catch (e) {}
  return {
    commodityList: null,
    valueChainStage: null,
    message: "Failed to select the commodity group",
  };
}
export async function selectComodityAction(
  prevState: RegionsListType,
  formData: FormData
): Promise<RegionsListType> {
  const schema = z.object({
    selectedComodity: z.string().min(1),
  });
  const parse = schema.safeParse({
    selectedComodity: formData.get("commodity_list"),
  });

  if (!parse.success) {
    return { regionList: null, message: "Failed to select comodity" };
  }

  const data = parse.data;
  // console.log({ data });

  try {
    // It's not the commodity, OECD depends only on the year and its calculation on the region
    // const regions = await getRegionsFrom(data.selectedComodity);
    const regions = await oecdService.getRegions('src-OECD_auth-Wiebe_from-2008_to-2015');

    revalidatePath("/");
    return { regionList: regions, message: null };
  } catch (e) {}
  return {
    regionList: null,
    message: "Failed to select the commodity",
  };
}
export async function selectRegionAction(
  prevState: ProductsListType,
  formData: FormData
): Promise<ProductsListType> {
  // console.log(formData.getAll("regions"));
  const schema = z.object({
    selectedRegions: z.array(z.string()),
  });
  const parse = schema.safeParse({
    selectedRegions: formData.getAll("regions"),
  });

  if (!parse.success) {
    return { productsList: null, message: "Failed to select regions" };
  }

  const data = parse.data;
  // console.log({ data });

  try {
    const products = await msrService.getProducts("");

    revalidatePath("/");
    return { productsList: products, message: null };
  } catch (e) {}
  return {
    productsList: null,
    message: "Failed to select the commodity",
  };
}
