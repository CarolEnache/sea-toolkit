'use server';
import { msrService } from '@/server/services';

export const preload = () => {
  void msrService.getProducts('src-MSR');
}

export default async function getLoaderData() {
  return {
    msr: await msrService.getProducts('src-MSR'),
  };
}