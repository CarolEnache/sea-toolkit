import { oecdService } from '@/server/services'
import 'server-only';

export const preload = () => {
  void oecdService.getRegions('src:OECD_auth:Wiebe_from:2008_to:2015');
}

export default async function getLoaderData() {
  return {
    regions: await oecdService.getRegions('src:OECD_auth:Wiebe_from:2008_to:2015'),
  };
}