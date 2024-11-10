import { join } from 'node:path';
import { renderToFile } from '@react-pdf/renderer';
import { document } from './src';

renderToFile(document, join(__dirname, `result.pdf`));
// eslint-disable-next-line no-console
console.log((new Date()).toISOString());
