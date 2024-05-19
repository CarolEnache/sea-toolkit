import fs from 'fs';

// Write enum with parquet file names in the directory
// Run this with node/bun

const files = fs.readdirSync('.');
const parquetFiles = files.filter((file) => file.endsWith('.parquet'));
const fileEnum = `export enum ParquetFiles {
  ${parquetFiles.map((file) => `${file.replace('.parquet', '')} = '${file}'`).join(',\n  ')}
}
`;
fs.writeFileSync('./parquet-files.ts', fileEnum, 'utf8');

