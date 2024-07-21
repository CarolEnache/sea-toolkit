'use server';
import { naceService } from '@/server/services'

export const preload = () => {
  void naceService.getIndustries();
}

export default async function getLoaderData() {
  return {
    industries: (await naceService.getIndustries()).slice(0, 4),
  };
}