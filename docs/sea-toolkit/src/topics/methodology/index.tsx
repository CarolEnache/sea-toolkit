import { Page } from '@/ui';
import { Intro } from './intro';
import { DataSources } from './data-sources';
import { ConsistencyAnalysis } from './consistency-analysis';
import { Unido } from './unido';
import { Footprint } from './footprint';
import { MSR } from './msr';

export const Methodology = () => (
  <Page>
    <Intro />
    <DataSources />
    <ConsistencyAnalysis />
    <Unido />
    <MSR />
    <Footprint />
  </Page>
);
