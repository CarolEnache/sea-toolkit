"use server";

import { msrService, oecdService } from "@/server/services";
import { reportService } from "@/server/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { FormDataType } from "@/components/form-generate-report";

type ReportData = {
  reportId: string | null;
  message?: string;
};

export async function getReportDataAction(id: string) {
  return reportService.generateReport(id);
}

export async function getDataFormFromServer() {
  const res = await Promise.all([
    oecdService.getRegions("oecd.wiebe_2008-2015"),
    msrService.getProducts("msr.cobalt-insitute_2019"),
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
      mining: formData.get("mining") === "",
      refining: formData.get("refining") === "",
      firstUse: formData.get("firstUse") === "",
      endUse: formData.get("endUse") === "",
      recycling: formData.get("recycling") === "",
    },
    firstUseMode: formData.get("firstUseMode"),
    contribution: {
      input: formData.get("input") === "",
      valueAdded: formData.get("valueAdded") === "",
    },
    effect: {
      directEffect: formData.get("directEffect") === "",
      firstRound: formData.get("firstRound") === "",
      industrialSupport: formData.get("industrialSupport") === "",
      incomeEffect: formData.get("incomeEffect") === "",
    },
  };
  const parse = schema.safeParse(formattedData);

  if (!parse.success) {
    return { report: null, message: "Failed to submit the form" };
  }

  const data = parse.data;
  try {
    const reportId = await reportService.requestReport(data);
    revalidatePath("/");
    if (reportId)
      return {
        reportId,
        message: "",
      };
  } catch {}
  return {
    reportId: null,
    message: "Failed to submit the form",
  };
}