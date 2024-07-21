import '../debug.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const { msr } = await getLoaderData();

  return (
    <div>
      <h1>MSR</h1>
      <pre className='code'>{`msrService.getProducts('src-MSR_auth-Wiebe_...')`}</pre>
      <pre>{JSON.stringify(msr, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
      <Navigation />
    </div>
  )
}