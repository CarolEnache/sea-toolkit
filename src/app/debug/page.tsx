import './debug.css';

export const Navigation = () => (
  <>
    <h2>Other debug pages</h2>
    <ul className='navigation'>
      <li><a href="/debug/footprintService">Footprint</a></li>
      <li><a href="/debug/msrService">MSR</a></li>
      <li><a href="/debug/oecdService">OECD</a></li>
      <li><a href="/debug/unidoService">UNIDO</a></li>
    </ul>
  </>
);

export default async function DebugPage() {
  return (
    <div>
      <h1>Debug Page</h1>
      <Navigation />
    </div>
  )
}
