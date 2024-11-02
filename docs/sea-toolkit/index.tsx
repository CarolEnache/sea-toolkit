import { renderToFile } from '@react-pdf/renderer';
import { document } from './src';

renderToFile(document, `${__dirname}/result.pdf`);
console.log((new Date()).toISOString());
