import React from 'react';

import { Navigation } from '../page';
import getLoaderData, { preload } from './loader';

import '../be-docs.css';

export default async function BeDocsPage() {
  preload();
  const { unido, industries, economicFactors, economicParameters } = await getLoaderData();

  return (
    <div>
      <h1>Unido</h1>
      <pre className="code">{`unidoService.getUnido('unido.wiebe_2008-2015')`}</pre>
      <pre>{JSON.stringify(unido, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
      <pre className="code">{`unidoService.getUnidoIndustries('unido.wiebe_2008-2015')`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <pre className="code">{`unidoService.getEconomicFactors('unido.wiebe_2008-2015')`}</pre>
      <pre>{JSON.stringify(economicFactors, null, 2)}</pre>
      <pre className="code">{`unidoService.getEconomicParameters('unido.wiebe_2008-2015')`}</pre>
      <pre>{JSON.stringify(economicParameters, null, 2)}</pre>
      <Navigation />
    </div>
  );
}
