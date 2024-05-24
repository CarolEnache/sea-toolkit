import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const unido = await getLoaderData();

  return (
    <div>
      <h1>Debug Page</h1>
      {/* <pre>{unido}</pre> */}
      <pre>{JSON.stringify(unido, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
    </div>
  )
}
