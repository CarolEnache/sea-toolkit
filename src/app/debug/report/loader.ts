'use server';
import { formData } from '@/server/holistic-approach/hardcoded-mocks';
import { generateReport } from '@/server/holistic-approach/report-output';

export const preload = () => {
  void generateReport(formData);
}

export default async function getLoaderData() {
  return await generateReport(formData);
}