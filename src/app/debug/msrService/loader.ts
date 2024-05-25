import { msrService } from '@/server/services'
import 'server-only';

export const preload = () => {
  void msrService.getProducts('src:MSR_auth:Wiebe_...');
}

export default async function getLoaderData() {
  return {
    msr: await msrService.getProducts('src:MSR_auth:Wiebe_...'),
  };
}