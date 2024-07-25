import "../debug.css";
import { Navigation } from "../page";
import { requestReport, deleteReportRequest } from "./actions";

import getLoaderData from "./loader";

export default async function DebugPage() {
  // preload();
  const { requests, report } = await getLoaderData();

  return (
    <div>
      <h1>Report</h1>
      <pre className="code">{`reportService.requestReport(formData)`}</pre>
      <form action={requestReport}>
        <button type="submit">Submit mock report</button>
      </form>
      <form action={deleteReportRequest}>
        <label>
          NACE code: <input type="text" name="report_id" />
        </label>
        <button type="submit">Delete Analyst Industries</button>
      </form>
      <pre>{JSON.stringify(requests, null, 2)}</pre>
      <pre className="code">{`reportService.generateReport('a04d3364')`}</pre>
      <pre>{JSON.stringify(report, null, 2)}</pre>
      <Navigation />
    </div>
  );
}
