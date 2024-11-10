import { Document } from '@react-pdf/renderer';
import { Methodology } from './topics/methodology/index.js';
import { Title } from './topics/title.js';

export const document = (
  <Document>
    <Title />
    <Methodology />
  </Document>
);
