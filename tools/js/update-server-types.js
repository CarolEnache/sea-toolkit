const { readdir, writeFile, rm } = require('node:fs/promises');
const { join, extname, basename } = require('node:path');

// Set the directory path
const sqlPath = join(__dirname, '../../src/server/services/sql');
const parquetPath = join(__dirname, '../../src/server/services/parquet');
const typePath = join(__dirname, '../../src/server/services/db-types.ts');
const beDocsPath = join(__dirname, '../../src/app/be-docs');
// Dev note
const comment = `/**\n * THIS FILE IS AUTO-GENERATED\n * DO NOT MODIFY IT\n * @see update-server-types.js\n */`

// Get the list of files in the directory
Promise.all([
  Promise.all([sqlPath, parquetPath].map(path => readdir(path))).then(([sqlFiles, parquetFiles]) => {
    const mapFiles = files => files.map(file => `'${basename(file, extname(file))}'`).join(' | ');
    const sqlTypeStr = `export type SqlFiles = ${mapFiles(sqlFiles)};`;
    const parquetTypeStr = `export type ParquetFiles = ${mapFiles(parquetFiles)};`;
    const helper = `export type OneOf<C, T extends C> = T;`;

    writeFile(typePath, `${comment}\n${sqlTypeStr}\n${parquetTypeStr}\n${helper}\n`, 'utf8');
  }),
  rm(beDocsPath, { recursive: true, force: true }),
]);

