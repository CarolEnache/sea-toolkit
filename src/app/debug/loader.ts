import { oecdService } from '@/server/approach/data-to-report/services/oecd-service'
import { unidoService } from '@/server/approach/data-to-report/services/unido-service'
import 'server-only';

export const preload = () => {
  void oecdService.getRegions('src:OECD_auth:Wiebe_from:2008_to:2015');
}

export default async function getLoaderData() {
  return await oecdService.getRegions('src:OECD_auth:Wiebe_from:2008_to:2015');
}