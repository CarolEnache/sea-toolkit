export async function PromiseMap<R extends { [k in K]: T }, K extends string, T>(obj: Record<K, T | Promise<T>> | Map<K, T | Promise<T>>) {
  const entries = obj instanceof Map ? Array.from(obj.entries()) : Object.entries(obj);

  const reponses = await Promise.all(entries.map(([key, promise]) => promise));

  return Object.fromEntries(entries.map(([key], index) => [key, reponses[index]])) as R;
}
