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
type SqlFiles = 'get-regions' | 'get-unido';

// DUCKDB Function that reads parquet files as tables
const read_parquet = (file_name: string, start_row?: number, page_size?: number) => {
  let stm = `read_parquet('${join(__dirname, `${file_name}.parquet`)}'`;
  if (page_size) {
    stm += `, ${start_row || 0}, ${page_size}`;
  } else if (start_row) {
    stm += `, ${start_row}`;
  }
  stm += ')';

  return stm;
}

export const runDbQuery = <T>(sqlFile: SqlFiles, parquetFileName: string, start_row?: number, page_size?: number) => new Promise<T>((resolve, reject) => {
  const query = readFileSync(join(__dirname, `${sqlFile}.sql`), 'utf8').replace('PARQUET_TABLE', read_parquet(parquetFileName, start_row, page_size));

  db.all(query, (error, response) => {
    if (error) reject(error);

    resolve(response as T);
  });
});
