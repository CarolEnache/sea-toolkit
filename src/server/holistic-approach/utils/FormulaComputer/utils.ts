export type Formula<T> = (context: T, helpers: typeof utils) => T;

const utils = {
  PRECISION: 1e16,

  sum: (array: number[]) => array.reduce((acc, val) => acc + (val * utils.PRECISION), 0) / utils.PRECISION,

  each: (objarr: any | any[]) => {
    if (Array.isArray(objarr)) {
      return objarr.map((item, index) => [index, item]);
    }

    return Object.entries(objarr);
  },

  transform: <T>(intialData: T, ...transformFns: Formula<T>[]): T =>
    transformFns.reduce((context, fn) => fn(context, utils), intialData),
};

const serialiser = ([k, v]: [string, { toString: Function }]) => `${k}:${v}`;
export default {
  toString: () => `const utils = {${Object.entries(utils).map(serialiser)}}`,
};
