'use server';
import { msrService } from '@/server/services';

export async function preload() {
  void msrService.getProducts('msr.cobalt-insitute_2019');
}

export default async function getLoaderData() {
  return {
    msr: await msrService.getProducts('msr.cobalt-insitute_2019'),
  };
}
