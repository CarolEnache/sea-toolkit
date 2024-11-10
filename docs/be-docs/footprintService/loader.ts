'use server';
import { footprintService } from '@/server/services';

export async function preload() {
  void footprintService.getIndustries();
  void footprintService.getAnalystIndustries();
}

export default async function getLoaderData() {
  return {
    industries: (await footprintService.getIndustries()).slice(0, 4),
    analystIndustries: await footprintService.getAnalystIndustries(),
  };
}
