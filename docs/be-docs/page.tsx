import React from "react";

import "./be-docs.css";

export const Navigation = () => (
  <section className="navigation">
    <h2>Other doc pages</h2>
    <ul>
      <li>
        <a href="/be-docs/old-report">Old Report</a>
      </li>
      <li>
        <a href="/be-docs/new-report">New Report</a>
      </li>
      <li>
        <a href="/be-docs/footprintService">Footprint</a>
      </li>
      <li>
        <a href="/be-docs/msrService">MSR</a>
      </li>
      <li>
        <a href="/be-docs/oecdService">OECD</a>
      </li>
      <li>
        <a href="/be-docs/unidoService">UNIDO</a>
      </li>
      <li>
        <a href="/be-docs/naceService">NACE</a>
      </li>
    </ul>
  </section>
);

export default async function BeDocsPage() {
  return (
    <div>
      <h1>BE Docs Page</h1>
      <Navigation />
    </div>
  );
}
