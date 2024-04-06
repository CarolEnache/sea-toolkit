"use server";

import { FirstUseMode, UUID } from "@/server/holistic-approach/io.types";
import { generateReport } from "@/server/holistic-approach/report-output";
import {
  getProductsFrom,
  getRegionsFrom,
} from "@/server/holistic-approach/selectors";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ComoditiesListType } from "./types";
import { time } from "console";
import { Carlito } from "next/font/google";

export const testAction = async () => {
  return JSON.parse(JSON.stringify([]));
};

const DUMMY_COMODITIES_LIST = {
  commodityList: ["Cobalt", "Nickel", "Copper", "Aluminium"],
  message: null,
};

const getDummyComotidiesFrom = (): Promise<ComoditiesListType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(DUMMY_COMODITIES_LIST);
    });
  });
};

export async function selectComodityList(
  prevState: ComoditiesListType,
  formData: FormData
): Promise<ComoditiesListType> {
  const schema = z.object({
    todo: z.string().min(1),
  });
  const parse = schema.safeParse({
    todo: formData.get("commodity_group"),
  });

  if (!parse.success) {
    return { commodityList: null, message: "Failed to create todo" };
  }

  const data = parse.data;
  console.log({ data });

  try {
    const comodities = await getDummyComotidiesFrom();

    revalidatePath("/");
    return comodities;
  } catch (e) {}
  return {
    commodityList: null,
    message: "Failed to select the commodity group",
  };
}