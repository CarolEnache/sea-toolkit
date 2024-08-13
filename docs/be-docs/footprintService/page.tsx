import React, { useState } from 'react';
import '../be-docs.css';
import { Navigation } from '../page';
import { deleteAnalystIndustries, setAnalystIndustries } from './actions';

import getLoaderData, { preload } from './loader';

export default async function DebugPage() {
  preload();
  const { industries, analystIndustries } = await getLoaderData();

  return (
    <div>
      <h1>Footprint</h1>
      <pre className="code">{`footprintService.getIndustries()`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <pre className="code">{`footprintService.setAnalystIndustries({ NACE: string; ISIC: string; OECD: string })`}</pre>
      <form action={setAnalystIndustries}>
        <label>
          NACE code: <input type="text" name="NACE" defaultValue="C2120" />
        </label>
        <label>
          ISIC code: <input type="text" name="ISIC" defaultValue="2100" />
        </label>
        <label>
          OECD code: <input type="text" name="OECD" defaultValue="D20T21" />
        </label>
        <button type="submit">Set Analyst Industries</button>
      </form>
      <pre className="code">{`footprintService.deleteAnalystIndustries({ NACE: string })`}</pre>
      <form action={deleteAnalystIndustries}>
        <label>
          NACE code: <input type="text" name="NACE" defaultValue="C2120" />
        </label>
        <button type="submit">Delete Analyst Industries</button>
      </form>
      <pre className="code">{`footprintService.getAnalystIndustries()`}</pre>
      <pre>{JSON.stringify(analystIndustries, null, 2)}</pre>
      <Navigation />
    </div>
  );
}
