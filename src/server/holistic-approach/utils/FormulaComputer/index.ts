import type { Formula } from './utils';

import { Worker } from "../AsyncWorker";
import utils from './utils';

export class FormulaComputer<T> {
  private formulas: Set<string>;

  constructor() {
    this.formulas = new Set();
  }

  addFormula(formula: Formula<T> | string) {
    this.formulas.add(formula.toString());

    return this;
  }

  async compute(workerData: T): Promise<T> {
    return new Worker<T>(
      `
const { parentPort, workerData } = require('worker_threads');
${utils.toString()};

parentPort.postMessage(
  utils.transform(
    workerData,
    ${Array.from(this.formulas)}
  )
);`,
      { eval: true, workerData }
    ).resolution;
  }
}
