'use server';
import { oecdService } from '@/server/services'

export const preload = () => {
  void oecdService.getRegions('oecd.wiebe_2008-2015');
  void oecdService.getIndustries('oecd.wiebe_2008-2015');
}

export default async function getLoaderData() {
  return {
    regions: await oecdService.getRegions('oecd.wiebe_2008-2015'),
    industries: (await oecdService.getIndustries('oecd.wiebe_2008-2015')).slice(0, 4),
  };
}