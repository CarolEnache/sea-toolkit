import { unidoService } from '@/server/services'
import 'server-only';

export const preload = () => {
  void unidoService.getUnido();
}

export default async function getLoaderData() {
  return {
    unido: (await unidoService.getUnido()).slice(0, 4),
  };
}