'use server';
import { unidoService } from '@/server/services'

export const preload = () => {
  void unidoService.getUnido();
  void unidoService.getIndustries();
}

export default async function getLoaderData() {
  return {
    unido: (await unidoService.getUnido()).slice(0, 4),
    industries: (await unidoService.getIndustries()).slice(0, 4),
  };
}