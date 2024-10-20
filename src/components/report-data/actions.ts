"use server";

import { reportService } from "@/server/services";

export async function getReportDataAction(id: string) {
    return reportService.generateReport(id);
  }