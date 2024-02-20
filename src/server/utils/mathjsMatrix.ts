import { ArgValue, ColumnName, MatrixIndex, RowName, Table, Row, CellValue } from "./types";

class Matrix {
  cols: ColumnName[]; // Column labels, for searching/debugging | A,B,C,D
  rows: RowName[]; // Row labels, for searching/debugging | 1,2,3,4
  matrix: Table; // This is an array of arrays to be used in mathjs

  constructor(matrix ?: Matrix) {
    this.cols = matrix?.cols ? structuredClone(matrix.cols) as ColumnName[] : [];
    this.rows = matrix?.rows ? structuredClone(matrix.rows) as RowName[] : [];
    this.matrix = matrix?.matrix ? structuredClone(matrix.matrix) as Table : [[]];
  }

  getColIndex(col: ColumnName): MatrixIndex {
    let index = this.cols.indexOf(col); // We search the col title
    if (index === -1) { // If not found we add it
      index = this.cols.length;
      this.cols.push(col);
    }
    return index;
  }

  getColAsArray(colIndex: MatrixIndex): CellValue[] {
    return this.matrix.map(row => row[colIndex]);
  }

  getColAsArrayByName(col: ColumnName): CellValue[] {
    return this.getColAsArray(this.getColIndex(col));
  }

  getRowIndex(row: RowName): MatrixIndex {
    let index = this.rows.indexOf(row); // We search the row title
    if (index === -1) { // If not found we add it
      index = this.rows.length;
      this.rows.push(row);
    }
    return index;
  }

  setValue(rowIndex: MatrixIndex, colIndex: MatrixIndex, value: ArgValue) { 
    const outputMatrix = this.matrix;
    if (!outputMatrix[rowIndex]) {
      outputMatrix[rowIndex] = [];
    }
    outputMatrix[rowIndex][colIndex] = typeof value === 'function' ? value(outputMatrix[rowIndex][colIndex] || 0) : value;
  }

  getRow(rowName: RowName): Row {
    const rowIndex = this.getRowIndex(rowName);
    return this.matrix[rowIndex];
  }

  setRow(rowName: RowName, rowValues: Row) {
    this.rows.push(rowName);
    this.matrix.push(rowValues);
  }

  setValueByName(row: RowName, col: ColumnName, value: ArgValue) {
    this.setValue(this.getRowIndex(row), this.getColIndex(col), value);
  }

  getValue(rowIndex: MatrixIndex, colIndex: MatrixIndex) {
    return this.matrix[rowIndex][colIndex];
  }

  getValueByName(row: RowName, col: ColumnName) {
    return this.getValue(this.getRowIndex(row), this.getColIndex(col));
  }

  removeCol(col: ColumnName) {
    const colIndex = this.getColIndex(col);
    this.cols.splice(colIndex, 1);
    this.matrix.forEach(row => row.splice(colIndex, 1));
  }
}


// export function mmult(matrix1: number[][], matrix2: number[][]): number[][] {
//   const result: number[][] = [];
//   for (let i = 0; i < matrix1.length; i++) { // iterates the rows of 1
//     result[i] = [];
//     for (let j = 0; j < matrix2[0].length; j++) { // iterates the columns of 2
//       let sum = 0;
//       for (let k = 0; k < matrix1[0].length; k++) { // iterates the columns of 1
//         sum += matrix1[i][k] * matrix2[k][j];
//       }
//       result[i][j] = sum;
//     }
//   }
//   return result;
// }




// Assuming you have a Matrix class defined with the following properties and methods:
// - rows: string[]
// - cols: string[]
// - getValueByName(row: string, col: string): number

// export function mmult(matrix1: Matrix, matrix2: Matrix): number[][] {
//   const result: number[][] = [];

//   for (const row1 of matrix1.rows) {
//     const currentRow: number[] = [];
//     for (const col2 of matrix2.cols) {
//       let sum = 0;
//       for (const col1 of matrix1.cols) {
//         sum += matrix1.getValueByName(row1, col1) * matrix2.getValueByName(col1, col2);
//       }
//       currentRow.push(sum);
//     }
//     result.push(currentRow);
//   }
//   return result;
// }

// M1
//      | I1 | I2
// LABR | x1 | x2

// M2
//      | I2 | I1
// C1   | y1 | y2
// C2   | z1 | z2

export function mmult(matrix1: Matrix, matrix2: Matrix): Matrix {
  const result = new Matrix();
  for (let row1 of matrix1.rows) { // i // iterates the rows of 1 // LABR
    // result[i] = [];
    for (let col2 of matrix2.cols) { // j // iterates the columns of 2 // I2 // I2
      // let sum = 0;
      for (let col1 of matrix2.cols) { // k // iterates the columns of 1 // I2 // I1
        // x2*y1 + x1*z1
        // x2*y1 + x1*z1
        const rowIndex = matrix2.getColIndex(col1); // 0 // 1 
        const colIndex = matrix2.getColIndex(col2); // 0 // 0
        const each = Number(matrix1.getValueByName(row1, col1)) * Number(matrix2.getValue(rowIndex, colIndex));
        result.setValueByName(row1, col2, previous => Number(previous) + each)
        // sum += matrix1[row1][col1] * matrix2[col1][col2];
        // sum += matrix1[i][k] * matrix2[k][j];
      }
      // result[i][j] = sum;
    }
  }
  return result;
}




// export function mmult(matrix1: Matrix, matrix2: Matrix): number[][] {
//   const result = new Matrix();
//   for (let row1 of matrix1.rows) { // i
//     for (let col1 of matrix1.cols) { // k
//       let sum = 0;
//       for (let row2 of matrix2.rows) { // j
//         result.setValueByName(row1, col1, )
//         sum += Number(matrix1.getValueByName(row1, col1)) * Number(matrix2.getValueByName(row2,col1));
//         // sum += matrix1[i][k] * matrix2[k][j];

//       }
//       [row1][col1]
//       // result[i][j] = sum;
//     }
//   }
//   return result;
// }


export default Matrix;
