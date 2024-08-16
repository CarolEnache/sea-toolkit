import React from 'react';

import '../be-docs.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function BeDocsPage() {
  preload();
  const { msr } = await getLoaderData();

  return (
    <div>
      <h1>MSR</h1>
      <pre className='code'>{`msrService.getProducts('msr.cobalt-insitute_2019')`}</pre>
      <pre>{JSON.stringify(msr, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
      <Navigation />
    </div>
  )
}
