"use server";

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Database } from 'duckdb';

import { ParquetFiles, SqlFiles } from './db-types';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialise the database
const db = new Database(':memory:');

// File string builder
const raw_parquet = (file_name: string) => `'${join(__dirname, 'parquet', `${file_name}.parquet`)}'`;

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

const getUpdateClause = (data: Partial<Shape>): string => {
  const entries = Object.entries(data);
  
  const setClauses = entries.map(([key, value]) => {
    // Handle different types of values
    if (typeof value === 'string') {
      return `${key} = '${value.replace(/'/g, "''")}'`; // Escape single quotes
    } else if (value === null) {
      return `${key} = NULL`;
    } else if (typeof value === 'boolean') {
      return `${key} = ${value ? 'TRUE' : 'FALSE'}`;
    } else {
      return `${key} = ${value}`;
    }
  });

  return `SET ${setClauses.join(', ')}`;
};

const getWhereClause = (data: Shape | Shape[]) => {
  const rows = Array.isArray(data) ? data : [data];

  const conditions = Object.keys(rows[0]).map(key => `${key} = '${rows[0][key]}'`).join(' AND ');

  return `WHERE ${conditions}`;
}

type Shape = Record<string, string | number | boolean>;
type QueryOptions = {
  insert?: Shape | Shape[],
  update?: Partial<Shape>,
  where?: Shape | Shape[],
  start_row?: number,
  page_size?: number,
};

export const runDynamicDbQuery = <T>(query: string, parquetFileName: ParquetFiles, options?: QueryOptions) => new Promise<T>((resolve, reject) => {
  if (query.includes('TempTable')) {
    query = query.replaceAll('TempTable', `${parquetFileName.replaceAll(/[^a-z]/g, '')}TempTable`);
  }

  if (query.includes('WHERE_CLAUSE') && options?.where) {
    const whereClause = getWhereClause(options.where);
    query = query.replaceAll('WHERE_CLAUSE', whereClause);
  }

  if (query.includes('UPDATE_CLAUSE') && options?.update) {
    const updateClause = getUpdateClause(options.update);
    query = query.replaceAll('UPDATE_CLAUSE', updateClause);
  } else if (query.includes('INSERT_CLAUSE') && options?.insert) {
    // Write operations need the raw path
    query = query.replaceAll('PARQUET_TABLE', raw_parquet(parquetFileName));

    const insertClause = getInsertClause(options.insert);
    query = query.replaceAll('INSERT_CLAUSE', insertClause);
  }
  
  if (options?.start_row || options?.page_size) {
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
export const runDbQuery = async <T>(sqlFile: SqlFiles, parquetFileName: ParquetFiles, options?: QueryOptions): Promise<T> => {
  let query = readFileSync(join(__dirname, 'sql', `${sqlFile}.sql`), 'utf8');

  return await runDynamicDbQuery(query, parquetFileName, options);
};

type TableSchema = { [key: string]: 'INT' | 'FLOAT' | 'VARCHAR' | 'BOOLEAN' };
type Options = { primaryKey?: string };
export const createDbTable = async (
  fileName: string,
  schema: TableSchema,
  options: Options = {}
) => new Promise<void>((resolve, reject) => {
  const filePath = raw_parquet(fileName);

  if (existsSync(filePath.slice(1,-1))) return resolve();

  const modifiers = Object.entries(schema)
    .map(([columnName, columnType]) => `${columnName} ${columnType}`);

  if (options.primaryKey) {
    modifiers.push(`PRIMARY KEY (${options.primaryKey})`);
  }

  const query = `CREATE TEMPORARY TABLE TempTable (${modifiers.join(', ')});COPY TempTable TO ${filePath};DROP TABLE TempTable;`;

  db.all(query, (error) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
});
