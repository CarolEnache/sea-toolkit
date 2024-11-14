import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Context } from './context';

describe('context', () => {
  let context: Context;

  beforeEach(() => {
    context = new Context();
  });

  it('inserts in a single cell, and works with named columns', () => {
    context.insert('Sheet!title1', 10);
    expect(context.select('Sheet!title:title')).toStrictEqual(10);
  });

  it('inserts in a row, and increments regular columns', () => {
    context.insert('Sheet!Z1', [10, 20]);
    expect(context.select('Sheet!Z:AA')).toStrictEqual([[10, 20]]);
  });

  it('inserts in a column', () => {
    context.insert('Sheet!A1', [[10], [20]]);
    expect(context.select('Sheet!A:A')).toStrictEqual([[10], [20]]);
  });

  it('inserts in a range', () => {
    context.insert('Sheet!title1', [[10, 20], [30, 40]]);
    expect(context.select('Sheet!title:titlf')).toStrictEqual([[10, 20], [30, 40]]);
  });

  it('should trigger listeners on value change', async () => new Promise((done) => {
    context.on('Sheet!A1', (value) => {
      expect(value).toBe(20);
      done(true);
    });
    context.insert('Sheet!A1', 20);
  }));

  it('should handle range selection', () => {
    context.insert('Sheet!A1', [[1, 2], [3, 4]]);
    expect(context.select('Sheet!A1:B2')).toEqual([[1, 2], [3, 4]]);
  });

  it.skip('should await values for a cell', async () => {
    setTimeout(() => {
      context.insert('Sheet!A1', 30);
    }, 100);
    const value = await context.awaitValues('Sheet!A1');
    expect(value).toBe(30);
  });

  it('should detect circular dependencies', () => {
    console.warn = vi.fn();
    context.on('Sheet!A1', vi.fn());
    context.insert('Sheet!A1', 10);
    context.insert('Sheet!A1', 20);
    context.insert('Sheet!A1', 30);
    context.insert('Sheet!A1', 40);
    expect(console.warn).toHaveBeenCalledWith('Circular dependency detected for event: Sheet!A1');
  });
});
