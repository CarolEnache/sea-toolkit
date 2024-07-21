'use server';
import { oecdService } from '@/server/services'

export const preload = () => {
  void oecdService.getRegions('src-OECD_auth-Wiebe_from-2008_to-2015');
  void oecdService.getIndustries('src-OECD_auth-Wiebe_from-2008_to-2015');
}

export default async function getLoaderData() {
  return {
    regions: await oecdService.getRegions('src-OECD_auth-Wiebe_from-2008_to-2015'),
    industries: (await oecdService.getIndustries('src-OECD_auth-Wiebe_from-2008_to-2015')).slice(0, 4),
  };
}