import * as fs from 'node:fs';
import * as path from 'node:path';
import parquet from 'parquetjs-lite';
import duckdb from 'duckdb';

// The remap object you will provide
const remap = {
  '2015_2008_oecd_employment': {
    'VAR': 'variable_code',
    'Indicator': 'indicator',
    'COU': 'country_code',
    'Country': 'country',
    'Region': 'region',
    'PAR': 'partner_code',
    'Partner': 'partner',
    'IND': 'oecd_code',
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
  },
  // Add more tables and columns as needed
};
// Function to rename columns in a Parquet file using DuckDB and parquetjs-lite
async function renameParquetColumns(parquetFilePath, tableName) {
  const db = new duckdb.Database(':memory:');
  const con = db.connect();

  try {
    // Read the parquet file into DuckDB
    const query = `SELECT * FROM '${parquetFilePath}'`;
    const rows = await new Promise((resolve, reject) => {
      con.all(query, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Get the remapping for the current table
    const tableRemap = remap[tableName];
    if (!tableRemap) {
      console.log(`No remap needed for table ${tableName}`);
      return;
    }

    // Remap the column names in each row
    const remappedRows = rows.map(row => {
      const newRow = {};
      for (const [oldColumn, value] of Object.entries(row)) {
        const newColumn = tableRemap[oldColumn] || oldColumn; // Rename if necessary
        newRow[newColumn] = value;
      }
      return newRow;
    });

    // Create the schema for the new Parquet file using the new column names
    const columns = Object.keys(remappedRows[0]);
    const schema = {};
    for (const col of columns) {
      switch (col.column_type) {
        case 'BIGINT':
          schema[col] = 'INT64';  // Keep BIGINT as INT64
          break;
        case 'INTEGER':
          schema[col] = 'INT32';  // Use smaller INT32 for INTEGER
          break;
        case 'DOUBLE':
          schema[col] = 'FLOAT';  // FLOAT instead of DOUBLE (if precision is not critical)
          break;
        case 'BOOLEAN':
          schema[col] = 'BOOLEAN';
          break;
        case 'VARCHAR':
          schema[col] = 'UTF8';   // Keep string as UTF8
          break;
        default:
          schema[col] = 'UTF8';   // Default to UTF8 for unknown types
      }
      // schema[col] = { type: 'UTF8' }; // Adjust data type as needed
    }
    
    const newParquetFilePath = parquetFilePath.replace('.parquet', '_renamed.parquet');

    // Write the new data to a new Parquet file using parquetjs-lite
    const writer = await parquet.ParquetWriter.openFile(
      new parquet.ParquetSchema(schema),
      newParquetFilePath, 
      {
        compression: 'SNAPPY', // Use GZIP compression for smaller file sizes
        rowGroupSize: rows.length * 4,
      },
    );
    for (const row of remappedRows) {
      for (const key in row) {
        if (typeof row[key] === 'undefined' || row[key] === null) {
          row[key] = '';
        }
        if (typeof row[key] === 'bigint' || typeof row[key] === 'number') {
          row[key] = Number(row[key]).toString(); // Convert BigInt to Number
        }
      }
      await writer.appendRow(row);
    }
    await writer.close();

    console.log(`Columns renamed and saved to ${newParquetFilePath}`);

  } catch (error) {
    console.error(`Error processing ${parquetFilePath}:`, error);
  } finally {
    con.close();
  }
}

// Main function to run the process
async function processFiles() {
  const parquetDir = './src/server/services/parquet/';

  // Read Parquet files and process each one
  const parquetFiles = fs.readdirSync(parquetDir).filter(file => file.endsWith('.parquet'));
  for (const parquetFile of parquetFiles) {
    const tableName = path.basename(parquetFile, path.extname(parquetFile)); // Get the table name from the file
    const parquetFilePath = path.join(parquetDir, parquetFile);
    await renameParquetColumns(parquetFilePath, tableName);
  }

  console.log('Parquet column renaming complete!');
}

// Run the process
processFiles().catch(console.error);
