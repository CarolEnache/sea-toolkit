import React from 'react';

import '../be-docs.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const { industries } = await getLoaderData();

  return (
    <div>
      <h1>Nace</h1>
      <pre className='code'>{`naceService.getNaceIndustries('nace.europa-eu_2024')`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <Navigation />
    </div>
  )
}
