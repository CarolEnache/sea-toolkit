'use server';
import { unidoService } from '@/server/services'

export const preload = () => {
  void unidoService.getUnido('src-UNIDO_auth-Wiebe_from-2008_to-2015');
  void unidoService.getIndustries('src-UNIDO_auth-Wiebe_from-2008_to-2015');
}

export default async function getLoaderData() {
  return {
    unido: (await unidoService.getUnido('src-UNIDO_auth-Wiebe_from-2008_to-2015')).slice(0, 4),
    industries: (await unidoService.getIndustries('src-UNIDO_auth-Wiebe_from-2008_to-2015')).slice(0, 4),
  };
}