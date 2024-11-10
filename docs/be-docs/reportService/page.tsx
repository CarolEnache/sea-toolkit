import React from 'react';

import { Navigation } from '../page';
import { deleteReportRequest, requestReport } from './actions';
import getLoaderData from './loader';

import '../be-docs.css';

export default async function BeDocsPage() {
  // preload();
  const { requests, report, report_id } = await getLoaderData();

  return (
    <div>
      <h1>Report</h1>
      <pre className="code">reportService.requestReport(formData)</pre>
      <form action={requestReport}>
        <button type="submit">Submit mock report</button>
      </form>
      <form action={deleteReportRequest}>
        <label>
          Report ID:
          {' '}
          <input type="text" name="report_id" defaultValue={report_id} />
        </label>
        <button type="submit">Delete Report</button>
      </form>
      <pre>
        Showing the last 4 entries:
        <br />
        {JSON.stringify(requests, null, 2)}
      </pre>
      <pre className="code">{`reportService.getReport('${report_id}')`}</pre>
      <pre>{JSON.stringify(report, null, 2)}</pre>
      <Navigation />
    </div>
  );
}
