import * as fs from 'node:fs';
import * as path from 'node:path';
import Database from 'better-sqlite3';
import duckdb from 'duckdb';

// Initialize the SQLite database
const db = new Database('output.db');

const columnMap = {
  'VAR': 'variable_code',
  'Indicator': 'indicator',
  'COU': 'country_code',
  'Country': 'country',
  'Region': 'region',
  'PAR': 'partner_code',
  'Partner': 'partner',
  'IND': 'industry_code',
  'Industry': 'industry',
  'TIME': 'time',
  'Year': 'year',
  'Unit Code': 'unit_code',
  'Unit': 'unit',
  'PowerCode Code': 'powercode_code',
  'PowerCode': 'powercode',
  'Reference Period Code': 'reference_period_code',
  'Reference Period': 'reference_period',
  'Value': 'value',
  'Flag Codes': 'flag_codes',
  'Flags': 'flags',
};

// Function to run SQL queries
function runSQLFromFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf-8');
  db.exec(sql); // Execute the SQL query
  console.log(`Executed SQL from ${filePath}`);
}

// Function to insert data from Parquet into the SQLite table
async function insertParquetDataIntoDB(parquetFilePath, tableName) {
  const duckDb = new duckdb.Database(':memory:');
  const con = duckDb.connect();

  const rows = await new Promise((resolve, reject) => {
    con.all(`SELECT * FROM '${parquetFilePath}'`, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
  // const reader = await parquet.ParquetReader.openFile(parquetFilePath);
  // const cursor = reader.getCursor();
  // let record = await cursor.next();

  const columnNames = Object.keys(rows[0]); // Get column names from the first row

  const placeholders = columnNames.map(() => '?').join(', ');
  const insertQuery = `INSERT INTO "${tableName}" ("${columnNames.map(c => columnMap[c] || c).join('", "')}") VALUES (${placeholders})`;
  console.log(insertQuery);
  const stmt = db.prepare(insertQuery);

  for (const record of rows) {
    const values = columnNames.map(name => record[name]);
    stmt.run(values); // Insert data into SQLite
  }

  await con.close();
  console.log(`Inserted data from ${parquetFilePath} into ${tableName}`);
}

// Main function to run the process
async function processFiles() {
  const sqlDir = './src/server/services/sql/';
  const parquetDir = './src/server/services/parquet/';

  // 1. Read and execute SQL files to create tables
  // const sqlFiles = fs.readdirSync(sqlDir).filter(file => file.endsWith('.sql'));
  // for (const sqlFile of sqlFiles) {
  //   const sqlFilePath = path.join(sqlDir, sqlFile);
  // }
  
  // 2. Read Parquet files and insert data into corresponding tables
  const parquetFiles = fs.readdirSync(parquetDir).filter(file => file.endsWith('.parquet'));
  for await (const parquetFile of parquetFiles) {
    const tableName = path.basename(parquetFile, path.extname(parquetFile)); // Remove extension to get the table name
    const parquetFilePath = path.join(parquetDir, parquetFile);
    const sqlFilePath = path.join(sqlDir, `create_${tableName}.sql`);
    runSQLFromFile(sqlFilePath);
    await insertParquetDataIntoDB(parquetFilePath, tableName);
  }

  console.log('Database setup and data insertion complete!');
}

// Run the process
processFiles().catch(console.error);
