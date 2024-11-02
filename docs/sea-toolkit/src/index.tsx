import { Document } from '@react-pdf/renderer';
import { Title } from './topics/title.js';
import { Methodology } from './topics/methodology/index.js';

export const document = (
  <Document>
    <Title />
    <Methodology />
  </Document>
)