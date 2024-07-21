import '../debug.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const { unido, industries } = await getLoaderData();

  return (
    <div>
      <h1>Unido</h1>
      <pre className='code'>{`unidoService.getUnido('src-UNIDO_auth-Wiebe_from-2008_to-2015')`}</pre>
      <pre>{JSON.stringify(unido, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
      <pre className='code'>{`unidoService.getUnidoIndustries('src-UNIDO_auth-Wiebe_from-2008_to-2015')`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <Navigation />
    </div>
  )
}
