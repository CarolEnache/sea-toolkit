import { H3, Link, Text } from '@/ui';

export const DataSources = () => (
  <>
    <H3>Data sources</H3>
    <Text>
      The process beggins by collating multiple sources (some of public access and
       some private) which include worldwide economic, social and political information
       about industries, their development and their performance.
    </Text>
    <Text>
      Some of the public data sources employed are distributed by the <Link href="https://www.unido.org/">United Nations
       Industrial Development Organisation</Link> (UNIDO) as well as the <Link href="https://www.oecd.org/en.html">Organisation for
       Economic Co-Operation and Development</Link> (OECD).
    </Text>
    <Text>
      These different sources will use different industry classification standards like:
       NACE, ISIC, NASIC, and other regional standards; and in order to facilitate the
       study of this information a manual match between industry codes is made by our
       in-house team.
    </Text>
  </>
);
