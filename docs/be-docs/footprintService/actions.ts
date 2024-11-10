'use server';
import { footprintService } from '@/server/services';

import { redirect } from 'next/navigation';

type AnalystIndustries = footprintService.AnalystIndustries;

export async function setAnalystIndustries(formData: FormData) {
  // Something is wrong here, why doesn't know the fields of formData?
  const analystIndustries = Object.fromEntries(formData.entries()) as AnalystIndustries;

  await footprintService.addAnalystIndustries({
    NACE: analystIndustries.NACE,
    ISIC: analystIndustries.ISIC,
    OECD: analystIndustries.OECD,
  });

  redirect('/be-docs/footprintService');
  // return await footprintService.getAnalystIndustries();
}

export async function deleteAnalystIndustries(formData: FormData) {
  // Something is wrong here, why doesn't know the fields of formData?
  const analystIndustries = Object.fromEntries(formData.entries()) as Pick<AnalystIndustries, 'NACE'>;

  await footprintService.delAnalystIndustries({
    NACE: analystIndustries.NACE,
  });

  redirect('/be-docs/footprintService');
  // return await footprintService.getAnalystIndustries();
}
