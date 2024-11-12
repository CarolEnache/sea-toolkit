type SheetData = { [cell: string]: any };
type Context = { [sheetName: string]: SheetData };

// Utility to convert column letters (like 'A', 'B', 'AA') to zero-based index
function columnToIndex(col: string) {
  let index = 0;
  for (let i = 0; i < col.length; i++) {
    index = index * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return index - 1;
}

// Convert cell address (like 'B3') to row and column indices
function cellToIndices(cell: string): [number, number] {
  const colMatch = cell.match(/[A-Z]+/);
  const rowMatch = cell.match(/\d+/);
  if (!colMatch || !rowMatch)
    throw new Error(`Invalid cell format: ${cell}`);
  return [Number.parseInt(rowMatch[0]) - 1, columnToIndex(colMatch[0])];
}

// Assign values of various shapes to the context
function assignToContext(context: Context, sheet: string, startCell: string, value: any) {
  const [startRow, startCol] = cellToIndices(startCell);

  if (Array.isArray(value)) {
    if (Array.isArray(value[0])) {
      // Matrix case
      value.forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
          const cell = `${String.fromCharCode('A'.charCodeAt(0) + startCol + colIndex)}${startRow + rowIndex + 1}`;
          setCell(context, sheet, cell, cellValue);
        });
      });
    }
    else {
      // Row case (if inserted as a single array)
      value.forEach((cellValue, colIndex) => {
        const cell = `${String.fromCharCode('A'.charCodeAt(0) + startCol + colIndex)}${startRow + 1}`;
        setCell(context, sheet, cell, cellValue);
      });
    }
  }
  else {
    // Single value case
    setCell(context, sheet, startCell, value);
  }
}

// Utility function to set a single cell
function setCell(context: Context, sheet: string, cell: string, value: any) {
  if (!context[sheet])
    context[sheet] = {};
  context[sheet][cell] = value;
}

// Select values within a range (returns a 2D array)
function select(context: Context, sheet: string, range: string): any[][] {
  const [startCell, endCell] = range.split(':');
  const [startRow, startCol] = cellToIndices(startCell);
  const [endRow, endCol] = cellToIndices(endCell);

  const result: any[][] = [];
  for (let row = startRow; row <= endRow; row++) {
    const rowValues: any[] = [];
    for (let col = startCol; col <= endCol; col++) {
      const cell = `${String.fromCharCode('A'.charCodeAt(0) + col)}${row + 1}`;
      rowValues.push(context[sheet]?.[cell] ?? null);
    }
    result.push(rowValues);
  }
  return result;
}

// Iterate over a range and apply a callback
function forEach(context: Context, sheet: string, range: string, callback: (value: any, row: number, col: number, cell: string) => void) {
  const [startCell, endCell] = range.split(':');
  const [startRow, startCol] = cellToIndices(startCell);
  const [endRow, endCol] = cellToIndices(endCell);

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = `${String.fromCharCode('A'.charCodeAt(0) + col)}${row + 1}`;
      const value = context[sheet]?.[cell] ?? null;
      callback(value, row, col, cell);
    }
  }
}

async function calculate(calculations: CalculationUnit[], context: Context) {
  const results: { [key: string]: any } = {};

  for (const unit of calculations) {
    const { id, sheet, formula } = unit;
    const result = await formula(context);

    // Store the result back into the context
    assignToContext(context, sheet, id, result);
    results[`${sheet}:${id}`] = result;
  }

  return results;
}

async function generateVariations(base: Record<string, any>, key: string, values: any[], valueCallback: (value: any, index: number) => Promise<any>): Promise<Record<string, any>[]> {
  const variations = [];
  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    const generatedValue = await valueCallback(value, index);
    variations.push({
      ...base,
      [key]: value,
      value: generatedValue,
    });
  }
  return variations;
}

export { assignToContext, calculate, Context, forEach, generateVariations, select };
