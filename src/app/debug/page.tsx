import getLoaderData, { preload } from "./loader";

export default async function DebugPage() {
  preload();
  const unido = await getLoaderData();

  return (
    <div>
      <h1>Debug Page</h1>
      {/* <pre>{unido}</pre> */}
      <pre>{JSON.stringify(unido, null, 2)}</pre>
    </div>
  )
}
