import { H3, Link, Text } from '@/ui';

export const ConsistencyAnalysis = () => (
  <>
    <Text>
      OECD data exposing economic exchanges between industries is processed to perform a
      consitency analysis.
    </Text>
    <H3>Consitency analysis</H3>
    <Text>
      A <Link href='https://en.wikipedia.org/wiki/Input%E2%80%93output_model'>Leontief input-output model</Link> depicts and analyzes the dependencies between
       an industry or sector and another through the input-output matrices and tables.
      But to grasp the full spectrum of dependencies in a market-driven economy,
       our consitency analysis explores these dependency relations in the terms of
       payments and intermediation relations where the flow of funds represent the
       movement of goods.
    </Text>
    <Text>
      Though most of this process is automated and data-driven, the calculation of the{' '}
       <Link href='https://en.wikipedia.org/wiki/Economic_base_analysis'>location quotients</Link> follows a hybrid approach, where different data sources
       for employment information are curated and combined by our in-house team
       before feeding it to the model. These location quotients are used to identify and
       classify the most relevant industries within an economic area.
    </Text>
  </>
);
