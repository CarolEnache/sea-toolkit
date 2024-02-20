function selectFromArray(arr, index) {
  return Array.isArray(index)
    ? (arr || []).slice(index[0], index[1])
    : arr[index] || 0;
}
export function sumFromArray(arr, init = 0) {
  return Array.isArray(arr)
    ? arr.reduce((sum, each) => sum + sumFromArray(each), init)
    : arr;
}

class TableMatrix {
  constructor(cols, rows, vals) {
    this.COLS = cols || [];
    this.ROWS = rows || [];
    this.VALS = vals || [];
  }

  print() {
    console.table([
      [, ...this.COLS],
      ...this.ROWS.map((row, i) => [row, ...(this.VALS[i] || [])]),
    ]);
    return this;
  }

  set([col, row], val) {
    if (!this.VALS[row]) {
      this.VALS[row] = [];
    }
    this.VALS[row][col] = val;
    return this;
  }

  get(col, row) {
    return Array.isArray(row)
      ? selectFromArray(this.VALS, row).map((sRow) =>
          selectFromArray(sRow, col)
        )
      : selectFromArray(selectFromArray(this.VALS, row), col);
  }

  sum(col, row) {
    return sumFromArray(this.get(col, row));
  }
}

export default TableMatrix;
