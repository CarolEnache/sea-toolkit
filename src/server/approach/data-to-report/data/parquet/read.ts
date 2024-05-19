import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ParquetFiles } from './parquet-files';

export { ParquetFiles } from './parquet-files';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const read = (file: ParquetFiles) => new Promise((resolve, reject) => {
  // Run the Python script
  const pythonProcess = spawn('python3', [join(__dirname, 'read.py'), file]);

  let response = '';
  // Listen for data from the Python script
  pythonProcess.stdout.on('data', (data) => {
    response += data.toString();
  });

  // Listen for errors from the Python script
  pythonProcess.stderr.on('data', (data) => {
    reject(data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      resolve(JSON.parse(response));
      // resolve(response);
    }
  });
});
