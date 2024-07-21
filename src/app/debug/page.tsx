import "./debug.css";

export const Navigation = () => (
  <section className="navigation">
    <h2>Other debug pages</h2>
    <ul>
      <li>
        <a href="/debug/old-report">Old Report</a>
      </li>
      <li>
        <a href="/debug/new-report">New Report</a>
      </li>
      <li>
        <a href="/debug/footprintService">Footprint</a>
      </li>
      <li>
        <a href="/debug/msrService">MSR</a>
      </li>
      <li>
        <a href="/debug/oecdService">OECD</a>
      </li>
      <li>
        <a href="/debug/unidoService">UNIDO</a>
      </li>
      <li>
        <a href="/debug/naceService">NACE</a>
      </li>
    </ul>
  </section>
);

export default async function DebugPage() {
  return (
    <div>
      <h1>Debug Page</h1>
      <Navigation />
    </div>
  );
}
