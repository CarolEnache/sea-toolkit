import { reportService } from "@/dummy-server/services";

export async function getReportDataAction(id: string) {
    return reportService.generateReport(id);
  }