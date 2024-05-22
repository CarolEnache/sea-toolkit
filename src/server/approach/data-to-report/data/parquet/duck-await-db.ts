import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// DUCKDB Function that reads parquet files as tables
export const read_parquet = (file_name: string, start_row?: number, page_size?: number) => {
  let stm = `read_parquet('${join(__dirname, `${file_name}.parquet`)}'`;
  if (page_size) {
    stm += `, ${start_row || 0}, ${page_size}`;
  } else if (start_row) {
    stm += `, ${start_row}`;
  }
  stm += ')';

  return stm;
}

export const query = <T>(query: string) => new Promise<T>((resolve, reject) => {
  // Run the Python script
  const processDuckDB = spawn('python3', [join(__dirname, 'duck-await-db.py'), query]);

  // Listen for errors from the Python script
  processDuckDB.stderr.on('data', (data) => {
    reject(data.toString());
  });

  // Initialise the response
  let response = '';
  // Listen for data from the Python script
  processDuckDB.stdout.on('data', (data) => {
    response += data.toString();
  });

  // When the process finishes
  processDuckDB.on('close', (code) => {
    if (code === 0 && response) {
      resolve(JSON.parse(response) as T);
    } else {
      reject({ status: 500, error: { message: 'Unexpected error' } });
    }
  });
});
