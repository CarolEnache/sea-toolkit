'use server';
import { unidoService } from '@/server/services';

export async function preload() {
  void unidoService.getUnido('unido.wiebe_2008-2015');
  void unidoService.getIndustries('unido.wiebe_2008-2015');
  void unidoService.getEconomicFactors('unido.wiebe_2008-2015');
  void unidoService.getEconomicParameters('unido.wiebe_2008-2015');
}

export default async function getLoaderData() {
  return {
    unido: (await unidoService.getUnido('unido.wiebe_2008-2015')).slice(0, 4),
    industries: (await unidoService.getIndustries('unido.wiebe_2008-2015')).slice(0, 4),
    economicFactors: (await unidoService.getEconomicFactors('unido.wiebe_2008-2015')),
    economicParameters: (await unidoService.getEconomicParameters('unido.wiebe_2008-2015')),
  };
}
