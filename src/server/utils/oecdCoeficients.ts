import { OECDRawInputOutput, OECDEmployment } from './dataStorage';
import Matrix, { mmult } from './mathjsMatrix';
import { closed as leontief } from './leontief';
import { OECD_UNUSED_SECTOR_TO, OECD_UNUSED_SECTOR_FROM } from '../constants';
import { REGIONS, SETTINGS } from './auxiliary';
import {
  OECDRawTitles,
  OECDRawVariables,
  Row,
  Table,
  OECDVariableSheet,
} from './types';

/**
 * This is the initial filter, it filters by the selected region
 * CODE-00001: We also added filtering of some unused columns
 */
const filterByRegion = (selectedRegion: string) => (row: Row) => {
  // COL is not in unused cols
  if (OECD_UNUSED_SECTOR_TO.includes(`${row[OECDRawTitles.COL]}`)) {
    return false;
  }
  // CODE-00002: We moved the row filtering to the way we create the oecdTypePrimitive
  // Filter by region if it's not Global
  if (selectedRegion && selectedRegion !== REGIONS.GLOBAL) {
    // And it's not the selected region
    if (row[OECDRawTitles.Region] !== selectedRegion) {
      return false;
    }
  }

  // Keep only the value added ? Review with spreadsheet
  // if (row[OECDRawTitles.VAR] === OECDRawVariables.VALUE_ADDED) {
  //   return true;
  // }

  return true;
};

const getOECDInputs = (OECDRawData: Table) => {
  // ✅ Approved by Carol
  const oecdInputs: OECDVariableSheet = {};
  OECDRawData.forEach((row) => {
    let VAR = `${row[OECDRawTitles.VAR]}` as OECDRawVariables;
    const ROW = `${row[OECDRawTitles.ROW]}`;
    if (VAR === OECDRawVariables.DOMESTIC && ROW === 'VALU') {
      VAR = OECDRawVariables.VALUE_ADDED; // Some Row have VAR==DOMESTIC, but their name is VALU, so they're actually VAL
    }
    const COL = `${row[OECDRawTitles.COL]}`;
    const POW = parseFloat(`${row[OECDRawTitles.PowerCodeCode]}`);
    const VAL = parseFloat(`${row[OECDRawTitles.Value]}`);

    if (!oecdInputs[VAR]) {
      oecdInputs[VAR] = new Matrix();
    }
    const output = oecdInputs[VAR] as Matrix; // Developers say: It's always defined Typescript :joy:

    output.setValueByName(
      ROW,
      COL,
      (previousValue) => Number(previousValue) + Math.pow(10, POW) * VAL
    );
  });

  /**
   * BUGFIX 2023.03.18: The order of the data for each variable was producing them to have different orders
   */
  const sortedOecdInputs: OECDVariableSheet = {};
  const variables = Object.keys(oecdInputs) as OECDRawVariables[];
  variables.forEach((VAR) => {
    const input = oecdInputs[VAR] as Matrix; // Developers say: It's always defined Typescript :joy:
    const colReference = structuredClone(input.cols || []).sort((a,b) => a > b ? 1 : -1);
    const rowReference = structuredClone(input.rows || []).sort((a,b) => a > b ? 1 : -1);
    sortedOecdInputs[VAR] = new Matrix({
      cols: colReference,
      rows: rowReference,
      matrix: rowReference.map(row => colReference.map(col => input.getValueByName(row, col)))
    } as Matrix);
  });

  // TODO: The oecdInputs sheet is also having calculations from OECDEmployment that haven't been implemented
  return { oecdInputs: sortedOecdInputs };
};

const getOECDDirectRequirements = ({ oecdInputs, selectedRegion }: { oecdInputs: OECDVariableSheet, selectedRegion: string }) => {
  const oecdDirectRequirements: OECDVariableSheet = {};
  /**
   * This is a matrix with just the industry rows and columns, to be able to calculate the types
   */
  const oecdTypePrimitive: OECDVariableSheet = {};

  Object.values(OECDRawVariables).forEach((VAR) => {
    if (!oecdDirectRequirements[VAR]) {
      oecdDirectRequirements[VAR] = new Matrix();
      // CODE-00002: This is part of the row filtering
      if (VAR !== OECDRawVariables.VALUE_ADDED) {
        oecdTypePrimitive[VAR] = new Matrix();
      }
    }

    oecdInputs[VAR]?.cols.forEach((col) => {
      const totalValue = oecdInputs[OECDRawVariables.TOTAL]?.getValueByName(
        'VALU',
        col
      );
      let totalOutput: number = 0;
      if (col === 'HFCE') {
        /**
         * TODO: This comes OECD Income using the "last year" (hardcoded to 2019 in the sheet)
         */
        totalOutput = 32889721200329.3;
      } else {
        totalOutput = Number(
          oecdInputs[OECDRawVariables.TOTAL]?.getValueByName('OUTPUT', col)
        );
      }

      oecdInputs[VAR]?.rows
        .filter((rowName) => {
          if (
            VAR !== OECDRawVariables.VALUE_ADDED &&
            OECD_UNUSED_SECTOR_FROM.includes(rowName)
          ) {
            return false; // We remove the unused rows here
          }

          if (VAR === OECDRawVariables.DOMESTIC && rowName.match(/^IMP_/)) {
            return false; // We remove the IMP in DOMIMP
          }

          return true;
        })
        .forEach((row) => {
          const previous = oecdInputs[VAR]?.getValueByName(row, col);
          let value: number;
          if (VAR === OECDRawVariables.VALUE_ADDED && row === 'VALU') {
            value =
              Math.min(Number(previous), Number(totalValue)) / totalOutput; // Querky totalValue
          } else {
            value = Number(previous) / totalOutput;
          }
          oecdDirectRequirements[VAR]?.setValueByName(row, col, value);

          // CODE-00002: This is part of the row filtering
          if (VAR !== OECDRawVariables.VALUE_ADDED) {
            oecdTypePrimitive[VAR]?.setValueByName(row, col, value);
          }

          // Direct requirements - coeficients table
          if (VAR === OECDRawVariables.TOTAL) {
            oecdDirectRequirements[OECDRawVariables.VALUE_ADDED]?.setValueByName('Direct Effects (imports) | Output', col, (previous) => Number(previous) + value);
          }
        });

      // Direct requirements - coeficients table
      if (VAR === OECDRawVariables.VALUE_ADDED) {
        const TXS_INT_FNL = oecdInputs[OECDRawVariables.TOTAL]?.getValueByName(
          'TXS_INT_FNL',
          col
        );
        const TXS_IMP_FNL = oecdInputs[OECDRawVariables.TOTAL]?.getValueByName(
          'TXS_IMP_FNL',
          col
        );
        const TTL_INT_FNL = oecdInputs[OECDRawVariables.TOTAL]?.getValueByName(
          'TTL_INT_FNL',
          col
        );
        const totalIntermediateExpenditureAtPurchasePrices = Number(TTL_INT_FNL) / Number(totalOutput);
        const domesticIntermediates = oecdDirectRequirements[OECDRawVariables.DOMESTIC]
          ?.getColAsArrayByName(col)
          .reduce((sum, each) => Number(sum) + Number(each), 0);
        oecdDirectRequirements[VAR]?.setValueByName(
          'TXS_INT_FNL',
          col,
          (Number(TXS_INT_FNL) + Number(TXS_IMP_FNL)) / Number(totalOutput)
        );
        oecdDirectRequirements[VAR]?.setValueByName('TTL_INT_FNL', col, totalIntermediateExpenditureAtPurchasePrices);
        oecdDirectRequirements[VAR]?.setValueByName(
          'Domestic intermediates',
          col,
          domesticIntermediates || 0
        );
        oecdDirectRequirements[VAR]?.setValueByName(
          'Imported intermediates',
          col,
          totalIntermediateExpenditureAtPurchasePrices - Number(domesticIntermediates)
        );
        oecdDirectRequirements[VAR]?.setValueByName('Employees', col, 0); // TODO: To really calculate them

        const operationgSurplusGross = oecdDirectRequirements[VAR]?.getValueByName('GOPS', col); // Row 98 @ Direct Requirements
        const estimatedCorporateTax = Number(operationgSurplusGross) * SETTINGS[selectedRegion]['Corporate Rate 2020']; // TODO: To review with Johann why 2020
        oecdDirectRequirements[VAR]?.setValueByName('Estimated corporate tax', col, estimatedCorporateTax);
        oecdDirectRequirements[VAR]?.setValueByName('Operating surplus, net', col, Number(operationgSurplusGross) - estimatedCorporateTax);
        oecdDirectRequirements[VAR]?.setValueByName('Estimated dividend tax', col, 0.0296654806780018); // TODO: ASK AGUSTIN - HARDCODED NUMBERS

        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (imports) | Income', col, 0); // TODO: 
        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (imports) | Employment', col, 0); // TODO: 
        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (imports) | Taxes', col, 0); // TODO: 

        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (domestic) | Output', col, 0); // TODO: 
        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (domestic) | Value Added', col, 0); // TODO: 
        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (domestic) | Income', col, 0); // TODO: 
        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (domestic) | Employment', col, 0); // TODO: 
        oecdDirectRequirements[VAR]?.setValueByName('Direct Effects (domestic) | Taxes', col, 0); // TODO: 
      }
    });
  });

  const directEffectsHelper = {
    TTL: new Matrix(oecdTypePrimitive.TTL),
    VAL: new Matrix({
      cols: oecdDirectRequirements.VAL?.cols || [],
      rows: ['LABR'],
      matrix: [oecdDirectRequirements.VAL?.getRow('LABR') || []]
    } as Matrix),
  };
  directEffectsHelper.TTL.removeCol('HFCE');
  directEffectsHelper.VAL.removeCol('HFCE');

  oecdDirectRequirements[OECDRawVariables.VALUE_ADDED]?.setRow(
    'Direct Effects (imports) | Value Added',
    mmult(
      directEffectsHelper.VAL,
      directEffectsHelper.TTL,
    ).matrix[0]
  );

  const hghghgh = {
    directEffectsHelper,
    res: mmult(
      directEffectsHelper.VAL,
      directEffectsHelper.TTL,
    ),
    result: oecdDirectRequirements[OECDRawVariables.VALUE_ADDED]?.getRow(
      'Direct Effects (imports) | Value Added',)
  }


  return { oecdDirectRequirements, oecdTypePrimitive, hghghgh };
};

const getOECDTypes = (
  oecdTypePrimitive: OECDVariableSheet,
  oecdDirectRequirements: OECDVariableSheet
) => {
  const oecdTypeI = {
    TTL: new Matrix(oecdTypePrimitive.TTL),
    DOMIMP: new Matrix(oecdTypePrimitive.DOMIMP),
  };

  oecdTypeI.TTL.removeCol('HFCE');
  oecdTypeI.DOMIMP.removeCol('HFCE');

  const oecdTypeII = {
    TTL: new Matrix(oecdTypePrimitive.TTL),
    DOMIMP: new Matrix(oecdTypePrimitive.DOMIMP),
  };

  const laborVal = oecdTypeII.TTL?.cols.map((colName) => {
    const labrValue =
      (oecdDirectRequirements.VAL?.getValueByName('LABR', colName) as number) || 0;
    // TODO: Add the minimum check from the Employement table
    // OECDEmployment
    // =IF(IO_Region="Global",SUMIFS('OECD Employment'!$R:$R,'OECD Employment'!$E:$E,"<>Other",'OECD Employment'!$H:$H,D$164,'OECD Employment'!$A:$A,$B166),SUMIFS('OECD Employment'!$R:$R,'OECD Employment'!$E:$E,IO_Region,'OECD Employment'!$H:$H,D$164,'OECD Employment'!$A:$A,$B166))
    // 'OECD Employment'!$R:$R => Value
    // 'OECD Employment'!$E:$E => Region
    // 'OECD Employment'!$H:$H => IND
    // 'OECD Employment'!$A:$A => VAR ?
    return Math.min(labrValue);
  });
  oecdTypeII.TTL.setRow('Labour Cost', laborVal);
  oecdTypeII.DOMIMP.setRow('Labour Cost', laborVal);

  return {
    oecdTypeI: {
      TOTAL: new Matrix({
        cols: oecdTypeI[OECDRawVariables.TOTAL]?.cols,
        rows: oecdTypeI[OECDRawVariables.TOTAL]?.rows,
        matrix: leontief(oecdTypeI[OECDRawVariables.TOTAL]?.matrix as number[][]),
      } as Matrix),
      DOMESTIC: new Matrix({
        cols: oecdTypeI[OECDRawVariables.DOMESTIC]?.cols,
        rows: oecdTypeI[OECDRawVariables.DOMESTIC]?.rows,
        matrix: leontief(oecdTypeI[OECDRawVariables.DOMESTIC]?.matrix as number[][]),
      } as Matrix),
    },
    oecdTypeII: {
      TOTAL: new Matrix({
        cols: oecdTypeII.TTL?.cols,
        rows: oecdTypeII.TTL?.rows,
        matrix: leontief(oecdTypeII.TTL?.matrix as number[][]),
      } as Matrix),
      DOMESTIC: new Matrix({
        cols: oecdTypeII.TTL?.cols,
        rows: oecdTypeII.TTL?.rows,
        matrix: leontief(oecdTypeII.DOMIMP?.matrix as number[][]),
      } as Matrix),
    },
  };
};

export const oecdCoeficients = ({ selectedRegion = REGIONS.GLOBAL } = {}) => {
  const OECDRawData: Table = OECDRawInputOutput.slice(1) // Remove the sheet titles
    .filter(filterByRegion(selectedRegion));

  const { oecdInputs } = getOECDInputs(OECDRawData);
  const { oecdDirectRequirements, oecdTypePrimitive } = getOECDDirectRequirements({ oecdInputs, selectedRegion });
  const { oecdTypeI, oecdTypeII } = getOECDTypes(oecdTypePrimitive, oecdDirectRequirements);

  return {
    oecdInputs,
    DirectRequirements: oecdDirectRequirements, // ✅
    // oecdTypePrimitive,
    typeI: oecdTypeI, // ✅
    /**
     * BUG: Type II is not returning the same value as the spreadsheet
     * There's HFCE being incorrect in the sheet, but even changing that keeps wrong
     * direct requirements is correct, something changes in between
     */
    typeII: oecdTypeII, // ❌
  };
};
