'use server';
import { formData } from '@/server/holistic-approach/hardcoded-mocks';
import { reportService } from '@/server/services';

export const preload = () => {
  void reportService.generateReport(formData);
}

export default async function getLoaderData() {
  return await reportService.generateReport(formData);
}