import { Page } from '@/ui';
import { ConsistencyAnalysis } from './consistency-analysis';
import { DataSources } from './data-sources';
import { Footprint } from './footprint';
import { Intro } from './intro';
import { MSR } from './msr';
import { Unido } from './unido';

export function Methodology() {
  return (
    <Page>
      <Intro />
      <DataSources />
      <ConsistencyAnalysis />
      <Unido />
      <MSR />
      <Footprint />
    </Page>
  );
}
