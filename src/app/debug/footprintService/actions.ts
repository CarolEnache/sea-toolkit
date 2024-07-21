'use server';
import { redirect } from 'next/navigation'

import { AnalystIndustries, footprintService } from '@/server/services'

// matches: Parameters<typeof footprintService.setAnalystIndustries>[0]

export const setAnalystIndustries = async (formData: FormData) => {
  // Something is wrong here, why doesn't know the fields of formData?
  const analystIndustries = Object.fromEntries(formData.entries()) as AnalystIndustries;
  
  await footprintService.setAnalystIndustries({
    NACE: analystIndustries.NACE,
    ISIC: analystIndustries.ISIC,
    OECD: analystIndustries.OECD,
  });

  // redirect('/debug/footprintService');
  return await footprintService.getAnalystIndustries();
}

export const deleteAnalystIndustries = async (formData: FormData) => {
  // Something is wrong here, why doesn't know the fields of formData?
  const analystIndustries = Object.fromEntries(formData.entries()) as Pick<AnalystIndustries, 'NACE'>;
  
  await footprintService.deleteAnalystIndustries({
    NACE: analystIndustries.NACE,
  });

  // redirect('/debug/footprintService');
  return await footprintService.getAnalystIndustries();
}
