type Listener = (value: any) => void | Promise<void>;
type CellRange = {
  sheet: string;
  startCol: number;
  startColName: string;
  startRow: number;
  endCol: number;
  endColName: string;
  endRow: number;
};

const MAX_REASSIGN = 3;

function columnNameToIndex(columnName: string): number {
  let index = 0;
  for (let i = 0; i < columnName.length; i++) {
    const charCode = columnName.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) { // A-Z
      index = index * 26 + (charCode - 65 + 1);
    }
    else if (charCode >= 97 && charCode <= 122) { // a-z
      index = index * 26 + (charCode - 97 + 1);
    }
  }
  return index;
}

function indexToColumnName(index: number): string {
  let columnName = '';
  while (index > 0) {
    const mod = (index - 1) % 26;
    columnName = String.fromCharCode(mod + 65) + columnName;
    index = Math.floor((index - 1) / 26);
  }
  return columnName;
}

function addToColumnName(columnName: string, addend: number): string {
  const index = columnNameToIndex(columnName);
  const newIndex = index + addend;
  return indexToColumnName(newIndex);
}

export class Context {
  private _sheets: Record<string, { data: number[][]; columns: string[] }> = {};
  private _listeners: Record<string, Map<symbol, Listener>> = {};
  private _touchCount: Record<string, number> = {};

  /** Allows to listen for value changes */
  on(range: string, listener: Listener): () => void {
    const { sheet, startColName, startRow } = this._parseRange(range);
    const event = `${sheet}!${startColName}${startRow}`;

    if (!this._listeners[event])
      this._listeners[event] = new Map();

    const symbol = Symbol(event);
    this._listeners[event].set(symbol, listener);

    return () => {
      this._listeners[event].delete(symbol);
    };
  }

  /** Emits value changes */
  private _emit(event: string, data: any): void {
    if (!this._listeners[event])
      return;

    if (!this._touchCount[event])
      this._touchCount[event] = 0;

    this._touchCount[event] += 1;

    if (this._touchCount[event] > MAX_REASSIGN) {
      console.warn(`Circular dependency detected for event: ${event}`);
      return;
    }

    for (const listener of this._listeners[event].values()) {
      listener(data);
    }
  }

  /** Parses a cell range string */
  private _parseRange(range: string): CellRange {
    // sheet
    const [sheet, cells] = range.split('!');
    if (!this._sheets[sheet]) {
      this._sheets[sheet] = { data: [], columns: [] };
    }

    // range
    const [startCell, endCell] = cells.split(':');
    // start range
    const startCellDigits = startCell.match(/\d*$/)?.[0] || '';
    const startRow = Number.parseInt(startCellDigits || '1', 10);
    const startColName = startCell.slice(0, startCell.length - startCellDigits.length);
    let startCol = this._sheets[sheet].columns.indexOf(startColName);
    if (startCol === -1 && startColName) {
      startCol = this._sheets[sheet].columns.push(startColName) - 1;
    }
    const result = { sheet, startCol, startColName, startRow, endCol: startCol, endColName: startColName, endRow: startRow };
    if (endCell) {
      // end range
      const endCellDigits = endCell.match(/\d*$/)?.[0] || '';
      result.endRow = endCellDigits ? Number.parseInt(endCellDigits, 10) : this._sheets[sheet].data.length;
      const endColName = endCell.slice(0, endCell.length - endCellDigits.length);
      let endCol = this._sheets[sheet].columns.indexOf(endColName);
      if (endCol === -1 && endColName) {
        endCol = this._sheets[sheet].columns.push(endColName) - 1;
      }
      result.endCol = endCol;
      result.endColName = endColName;
    }
    console.log(result);
    return result;
  }

  /** Select method to retrieve values */
  select(range: string): any {
    const { sheet, startCol, startRow, endCol, endRow } = this._parseRange(range);
    if (startRow !== endRow || startCol !== endCol) {
      const result = [];
      for (let row = startRow; row <= endRow; row++) {
        const rowResult = [];
        for (let col = startCol; col <= endCol; col++) {
          rowResult.push(this._sheets[sheet]?.data[row - 1]?.[col - 1] || 0);
        }
        result.push(rowResult);
      }
      return result;
    }
    else {
      return this._sheets[sheet]?.data[startRow - 1]?.[startCol - 1] || 0;
    }
  }

  /** Insert method to modify values */
  insert(range: string, values: any): void {
    const { sheet, startCol, startColName, startRow } = this._parseRange(range);

    if (!Array.isArray(values)) {
      values = [[values]];
    }
    else if (!Array.isArray(values[0])) {
      values = [values];
    }

    values.forEach((row: any[], rowIndex: number) => {
      if (!this._sheets[sheet].data[startRow - 1 + rowIndex]) {
        this._sheets[sheet].data[startRow - 1 + rowIndex] = [];
      }

      row.forEach((value: any, colIndex: number) => {
        const colName = this._getColName(sheet, colIndex, startCol, startColName);
        if (!this._sheets[sheet].columns.includes(colName)) {
          this._sheets[sheet].columns.push(colName);
        }
        this._sheets[sheet].data[startRow - 1 + rowIndex][startCol - 1 + colIndex] = value;
        this._emit(`${sheet}!${colName}${startRow + rowIndex}`, value);
      });
    });
  }

  /** Async method to await values for cell or range */
  async awaitValues(range: string): Promise<any> {
    return new Promise((resolve) => {
      const unsubscribe = this.on(range, (value) => {
        unsubscribe();
        resolve(value);
      });
    });
  }

  private _getColName(sheet: string, colIndex: number, startCol: number, startColName: string): string {
    const currentCol = colIndex + startCol;
    const currentName = this._sheets[sheet].columns[currentCol];

    if (currentName)
      return currentName;

    return addToColumnName(startColName, colIndex);
  }
}
