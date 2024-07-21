import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Database } from 'duckdb';
import { readFileSync } from 'node:fs';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialise the database
const db = new Database(':memory:');

// List of sql files
type SqlFiles = 'get-regions' | 'get-products' | 'get-unido' |
  'get-oecd-industries' | 'get-unido-industries' | 'get-nace-industries' |
  'get-analyst-industries' | 'update-analyst-industries' | 'delete-analyst-industries';

// File string builder
const raw_parquet = (file_name: string) => `'${join(__dirname, `${file_name}.parquet`)}'`;

// DUCKDB Function that reads parquet files as tables
const read_parquet = (file_name: string, start_row?: number, page_size?: number) => {
  let stm = `read_parquet(${raw_parquet(file_name)}`;
  if (page_size) {
    stm += `, ${start_row || 0}, ${page_size}`;
  } else if (start_row) {
    stm += `, ${start_row}`;
  }
  stm += ')';

  return stm;
}

const getInsertClause = (data: Shape | Shape[]) => {
  const rows = Array.isArray(data) ? data : [data];

  const columns = Object.keys(rows[0]).join(', ');
  const values = rows.map(row => `('${Object.values(row).join(`', '`)}')`).join(', ');

  return `(${columns}) VALUES ${values}`;
}

const getWhereClause = (data: Shape | Shape[]) => {
  const rows = Array.isArray(data) ? data : [data];

  const conditions = Object.keys(rows[0]).map(key => `${key} = '${rows[0][key]}'`).join(' AND ');

  return `WHERE ${conditions}`;
}

type Shape = Record<string, string | number | boolean>;
type QueryOptions = {
  insert?: Shape | Shape[],
  where?: Shape | Shape[],
  start_row?: number,
  page_size?: number,
};

export const runDbQuery = <T>(sqlFile: SqlFiles, parquetFileName: string, options?: QueryOptions) => new Promise<T>((resolve, reject) => {
  let query = readFileSync(join(__dirname, `${sqlFile}.sql`), 'utf8');
  
  if (query.includes('WHERE_CLAUSE') && options?.where) {
    const whereClause = getWhereClause(options.where);
    query = query.replaceAll('WHERE_CLAUSE', whereClause);
  }

  if (query.includes('INSERT_CLAUSE') && options?.insert) {
    // Write operations need the raw path
    query = query.replaceAll('PARQUET_TABLE', raw_parquet(parquetFileName));

    const insertClause = getInsertClause(options.insert);
    query = query.replaceAll('INSERT_CLAUSE', insertClause);
  } else if (options?.start_row || options?.page_size) {
    // The read_parquet is only needed for pagination
    query = query.replaceAll('PARQUET_TABLE', read_parquet(parquetFileName, options?.start_row, options?.page_size));
  } else {
    // Use the raw path by default
    query = query.replaceAll('PARQUET_TABLE', raw_parquet(parquetFileName));
  }

  db.all(query, (error, response) => {
    if (error) reject(error);

    resolve(response as T);
  });
});
