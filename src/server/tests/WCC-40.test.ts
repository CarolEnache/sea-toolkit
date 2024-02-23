import { it } from 'node:test';
import assert from 'node:assert';

import { getOECDEmployment } from '../utils/oecdCoeficients';

const matches = (a: unknown, b: number) => assert.strictEqual(
  parseFloat(`${a || 0}`).toFixed(0),
  `${b || 0}`
);

it('getOECDEmployment returns the right data for Labour', () => {
  const labour = getOECDEmployment('Global');

  matches(labour.getValueByName('LABR', 'D01T03'), 1239105800000);
  matches(labour.getValueByName('LABR', 'D05T06'), 247212600000);
  matches(labour.getValueByName('LABR', 'D07T08'), 110614100000);
  matches(labour.getValueByName('LABR', 'D09'), 71119600000);
  matches(labour.getValueByName('LABR', 'D10T12'), 588652300000);
  matches(labour.getValueByName('LABR', 'D13T15'), 293154300000);
  matches(labour.getValueByName('LABR', 'D16'), 95278500000);
  matches(labour.getValueByName('LABR', 'D17T18'), 209241400000);
  matches(labour.getValueByName('LABR', 'D19'), 80575500000);
  matches(labour.getValueByName('LABR', 'D20T21'), 448030400000);
  matches(labour.getValueByName('LABR', 'D22'), 237801000000);
});
