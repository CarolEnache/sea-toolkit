import { describe, it } from 'node:test';
import assert from 'node:assert';

import { oecdCoeficients } from '../utils/oecdCoeficients';
import { OECDRawVariables } from '../utils/types';

describe('oecdCoefficients util', () => {
  const coefficients = oecdCoeficients();

  if (typeof coefficients.DirectRequirements !== 'undefined') {
    describe('when returning oecdDirectRequirements', () => {
      const { DirectRequirements } = coefficients;
      it('has total rows equal to domestic rows', () => {
        assert.strictEqual(
          DirectRequirements[OECDRawVariables.TOTAL]?.rows?.length,
          DirectRequirements[OECDRawVariables.DOMESTIC]?.rows?.length
        );
      });
      it('has the right value for Domestic intermediaries', () => {
        assert.strictEqual(
          parseFloat(
            `${
              DirectRequirements[OECDRawVariables.VALUE_ADDED]?.getValueByName(
                'Domestic intermediates',
                'D01T03'
              ) || 0
            }`
          ).toFixed(7),
          '0.4177632'
        );
        assert.strictEqual(
          parseFloat(
            `${
              DirectRequirements[OECDRawVariables.VALUE_ADDED]?.getValueByName(
                'Domestic intermediates',
                'D07T08'
              ) || 0
            }`
          ).toFixed(7),
          '0.4545871'
        );
        assert.strictEqual(
          parseFloat(
            `${
              DirectRequirements[OECDRawVariables.VALUE_ADDED]?.getValueByName(
                'Domestic intermediates',
                'D13T15'
              ) || 0
            }`
          ).toFixed(7),
          '0.6058234'
        );
      });
      // {
      //   VALUE_ADDED: {
      //     D01T03: {
      //       'TXS_INT_FNL': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('TXS_INT_FNL', 'D01T03'),
      //       'TTL_INT_FNL': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('TTL_INT_FNL', 'D01T03'),
      //       'Domestic intermediates': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('Domestic intermediates', 'D01T03'),
      //       'Imported intermediates': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('Imported intermediates', 'D01T03'),
      //       'Value added': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('VALU', 'D01T03'),
      //       'Taxes on production': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('OTXS', 'D01T03'),
      //       'Labour cost': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('LABR', 'D01T03'),
      //       'Operating surplus, gross': oecdDirectRequirements[OECDRawVariables.VALUE_ADDED].getValueByName('GOPS', 'D01T03'),
      //     },
      //   },
      //   D01T03: {
      //     DOM_01T03: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_01T03', 'D01T03'), 0.15281070],
      //     DOM_05T06: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_05T06', 'D01T03'), 0.00153314],
      //     DOM_07T08: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_07T08', 'D01T03'), 0.00063531],
      //     DOM_09: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_09', 'D01T03'), 0.00322329],
      //     DOM_10T12: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_10T12', 'D01T03'), 0.07258892],
      //     DOM_13T15: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_13T15', 'D01T03'), 0.00246866],
      //     DOM_16: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_16', 'D01T03'), 0.00111496],
      //     DOM_17T18: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_17T18', 'D01T03'), 0.00149865],
      //     DOM_19: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_19', 'D01T03'), 0.02013333],
      //     DOM_20T21: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_20T21', 'D01T03'), 0.02634719],
      //     DOM_22: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_22', 'D01T03'), 0.00273352],
      //     DOM_23: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_23', 'D01T03'), 0.00149588],
      //     DOM_24: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_24', 'D01T03'), 0.00075564],
      //     DOM_25: [oecdDirectRequirements[OECDRawVariables.DOMESTIC].getValueByName('DOM_25', 'D01T03'), 0.00265580],
      //   }
      // };
    });
  }

  if (typeof coefficients.oecdTypePrimitive !== 'undefined') {
    describe('when oecdTypePrimitive is returned', () => {
      const { oecdTypePrimitive, DirectRequirements } = coefficients;
      for (const col of oecdTypePrimitive.DOMIMP?.cols || []) {
        for (const row of oecdTypePrimitive.DOMIMP?.rows || []) {
          it(`matches col ${col} & row ${row}`, () => {
            assert.strictEqual(oecdTypePrimitive.DOMIMP?.getValueByName(row, col), DirectRequirements.DOMIMP?.getValueByName(row, col));
          });
        }
      }
    });
  }

  if (
    typeof coefficients.typeI !== 'undefined' &&
    typeof coefficients.typeI.TOTAL !== 'undefined'
  ) {
    describe('when type I TOTAL is returned', () => {
      const { typeI } = coefficients;
      it('matches industry 01T03', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.TOTAL.getValueByName('TTL_01T03', 'D01T03') || 0}`
          ).toFixed(7),
          '1.2404530'
        );
        assert.strictEqual(
          parseFloat(
            `${typeI.TOTAL.getValueByName('TTL_01T03', 'D05T06') || 0}`
          ).toFixed(7),
          '0.0108793'
        );
        assert.strictEqual(
          parseFloat(
            `${typeI.TOTAL.getValueByName('TTL_01T03', 'D07T08') || 0}`
          ).toFixed(7),
          '0.0132650'
        );
        assert.strictEqual(
          parseFloat(
            `${typeI.TOTAL.getValueByName('TTL_01T03', 'D09') || 0}`
          ).toFixed(7),
          '0.0073205'
        );
      });
      it('matches industry 05T06', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.TOTAL.getValueByName('TTL_05T06', 'D05T06') || 0}`
          ).toFixed(7),
          '1.1079934'
        );
      });
      it('matches industry 07T08', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.TOTAL.getValueByName('TTL_07T08', 'D07T08') || 0}`
          ).toFixed(7),
          '1.0734258'
        );
      });
      it('matches industry 09', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.TOTAL.getValueByName('TTL_09', 'D09') || 0}`
          ).toFixed(7),
          '1.1587433'
        );
      });
    });
  }

  if (
    typeof coefficients.typeI !== 'undefined' &&
    typeof coefficients.typeI.DOMESTIC !== 'undefined'
  ) {
    describe('when type I DOMESTIC is returned', () => {
      const { typeI } = coefficients;
      it('matches industry 01T03', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.DOMESTIC.getValueByName('DOM_01T03', 'D01T03') || 0}`
          ).toFixed(7),
          '1.2158749'
        );
        assert.strictEqual(
          parseFloat(
            `${typeI.DOMESTIC.getValueByName('DOM_01T03', 'D05T06') || 0}`
          ).toFixed(7),
          '0.0084752'
        );
        assert.strictEqual(
          parseFloat(
            `${typeI.DOMESTIC.getValueByName('DOM_01T03', 'D07T08') || 0}`
          ).toFixed(7),
          '0.0096855'
        );
        assert.strictEqual(
          parseFloat(
            `${typeI.DOMESTIC.getValueByName('DOM_01T03', 'D09') || 0}`
          ).toFixed(7),
          '0.0049571'
        );
      });
      it('matches industry 05T06', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.DOMESTIC.getValueByName('DOM_05T06', 'D05T06') || 0}`
          ).toFixed(7),
          '1.0769222'
        );
      });
      it('matches industry 07T08', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.DOMESTIC.getValueByName('DOM_07T08', 'D07T08') || 0}`
          ).toFixed(7),
          '1.0595438'
        );
      });
      it('matches industry 09', () => {
        assert.strictEqual(
          parseFloat(
            `${typeI.DOMESTIC.getValueByName('DOM_09', 'D09') || 0}`
          ).toFixed(7),
          '1.1521602'
        );
      });
    });
  }

  if (
    typeof coefficients.typeII !== 'undefined' &&
    typeof coefficients.typeII.TOTAL !== 'undefined'
  ) {
    describe('when type II TOTAL is returned', () => {
      const { typeII } = coefficients;
      it('matches industry 01T03', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.TOTAL.getValueByName('TTL_01T03', 'D01T03') || 0}`
          ).toFixed(7),
          '1.3197538'
        );
        assert.strictEqual(
          parseFloat(
            `${typeII.TOTAL.getValueByName('TTL_01T03', 'D05T06') || 0}`
          ).toFixed(7),
          '0.0544819'
        );
        assert.strictEqual(
          parseFloat(
            `${typeII.TOTAL.getValueByName('TTL_01T03', 'D07T08') || 0}`
          ).toFixed(7),
          '0.0696857'
        );
        assert.strictEqual(
          parseFloat(
            `${typeII.TOTAL.getValueByName('TTL_01T03', 'D09') || 0}`
          ).toFixed(7),
          '0.0746848'
        );
      });
      it('matches industry 05T06', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.TOTAL.getValueByName('TTL_05T06', 'D05T06') || 0}`
          ).toFixed(7),
          '1.1235844'
        );
      });
      it('matches industry 07T08', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.TOTAL.getValueByName('TTL_07T08', 'D07T08') || 0}`
          ).toFixed(7),
          '1.0768230'
        );
      });
      it('matches industry 09', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.TOTAL.getValueByName('TTL_09', 'D09') || 0}`
          ).toFixed(7),
          '1.1609358'
        );
      });
    });
  }

  if (
    typeof coefficients.typeII !== 'undefined' &&
    typeof coefficients.typeII.DOMESTIC !== 'undefined'
  ) {
    describe('when type II DOMESTIC is returned', () => {
      const { typeII } = coefficients;
      it('matches industry 01T03', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.DOMESTIC.getValueByName('DOM_01T03', 'D01T03') || 0}`
          ).toFixed(7),
          '1.2700237'
        );
        assert.strictEqual(
          parseFloat(
            `${typeII.DOMESTIC.getValueByName('DOM_01T03', 'D05T06') || 0}`
          ).toFixed(7),
          '0.0371807'
        );
        assert.strictEqual(
          parseFloat(
            `${typeII.DOMESTIC.getValueByName('DOM_01T03', 'D07T08') || 0}`
          ).toFixed(7),
          '0.0461345'
        );
        assert.strictEqual(
          parseFloat(
            `${typeII.DOMESTIC.getValueByName('DOM_01T03', 'D09') || 0}`
          ).toFixed(7),
          '0.0506527'
        );
      });
      it('matches industry 05T06', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.DOMESTIC.getValueByName('DOM_05T06', 'D05T06') || 0}`
          ).toFixed(7),
          '1.0813368'
        );
      });
      it('matches industry 07T08', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.DOMESTIC.getValueByName('DOM_07T08', 'D07T08') || 0}`
          ).toFixed(7),
          '1.0606439'
        );
      });
      it('matches industry 09', () => {
        assert.strictEqual(
          parseFloat(
            `${typeII.DOMESTIC.getValueByName('DOM_09', 'D09') || 0}`
          ).toFixed(7),
          '1.1530426'
        );
      });
    });
  }
});
