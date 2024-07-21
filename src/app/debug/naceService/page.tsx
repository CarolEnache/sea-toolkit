import '../debug.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const { industries } = await getLoaderData();

  return (
    <div>
      <h1>Nace</h1>
      <pre className='code'>{`naceService.getNaceIndustries('src-NACE-2_auth-EuropaEU_year-2024')`}</pre>
      <pre>{JSON.stringify(industries, null, 2)}</pre>
      <Navigation />
    </div>
  )
}
