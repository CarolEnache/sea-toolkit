import { unidoService } from '@/server/approach/data-to-report/services/unido-service'
import 'server-only';

export const preload = () => {
  void unidoService.getUnido();
}

export default async function getLoaderData() {
  return await unidoService.getUnido();
}