import '../debug.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const { regions, industries } = await getLoaderData();

  return (
    <div>
      <h1>OECD Service</h1>
      <pre className='code'>{`oecdService.getRegions('src-OECD_auth-Wiebe_from-2008_to-2015')`}</pre>
      <pre>{JSON.stringify(regions, null, 2)}</pre>
      <pre className='code'>{`oecdService.getIndustries('src-OECD_auth-Wiebe_from-2008_to-2015')`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <Navigation />
    </div>
  )
}
