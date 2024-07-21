import '../debug.css';
import { Navigation } from '../page';

import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const report = await getLoaderData();

  return (
    <div>
      <h1>Report</h1>
      <pre className='code'>{`generateReport(formData)`}</pre>
      <pre>{JSON.stringify(report, null, 2)}</pre>
      <Navigation />
    </div>
  )
}
