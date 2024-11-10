'use server';
import { naceService } from '@/server/services';

export async function preload() {
  void naceService.getIndustries('nace.europa-eu_2024');
}

export default async function getLoaderData() {
  return {
    industries: (await naceService.getIndustries('nace.europa-eu_2024')).slice(0, 4),
  };
}
