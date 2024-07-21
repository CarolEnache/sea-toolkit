'use server';
import { naceService } from '@/server/services'

export const preload = () => {
  void naceService.getIndustries('src-NACE-2_auth-EuropaEU_year-2024');
}

export default async function getLoaderData() {
  return {
    industries: (await naceService.getIndustries('src-NACE-2_auth-EuropaEU_year-2024')).slice(0, 4),
  };
}