import React from 'react';

import { Navigation } from '../page';
import getLoaderData, { preload } from './loader';

import '../be-docs.css';

export default async function BeDocsPage() {
  preload();
  const { regions, industries } = await getLoaderData();

  return (
    <div>
      <h1>OECD Service</h1>
      <pre className="code">{`oecdService.getRegions('oecd.wiebe_2008-2015')`}</pre>
      <pre>{JSON.stringify(regions, null, 2)}</pre>
      <pre className="code">{`oecdService.getIndustries('oecd.wiebe_2008-2015')`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <Navigation />
    </div>
  );
}
