import '../debug.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const { unido, industries } = await getLoaderData();

  return (
    <div>
      <h1>Unido</h1>
      <pre className='code'>{`unidoService.getUnido()`}</pre>
      <pre>{JSON.stringify(unido, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
      <pre className='code'>{`unidoService.getUnidoIndustries()`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <Navigation />
    </div>
  )
}
