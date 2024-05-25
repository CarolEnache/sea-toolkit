import '../debug.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const { footprint } = await getLoaderData();

  return (
    <div>
      <h1>Footprint</h1>
      <pre className='code'>{`oecdService.getRegions('src:OECD_auth:Wiebe_from:2008_to:2015')`}</pre>
      <pre>{JSON.stringify(footprint, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
      <Navigation />
    </div>
  )
}
