/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";

import { allocateWaffleCells } from "./allocate-waffle-cells";

function sum(values: readonly number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

describe("allocateWaffleCells", () => {
  test("exact percentages map one cell per percent", () => {
    expect(allocateWaffleCells([40, 25, 18, 12, 5], 100)).toEqual([
      40, 25, 18, 12, 5,
    ]);
  });

  test("rounded shares always fill every cell", () => {
    const counts: number[] = allocateWaffleCells([1, 1, 1], 100);
    expect(sum(counts)).toBe(100);
    expect(counts).toEqual([34, 33, 33]);
  });

  test("no value is more than one cell from its exact share", () => {
    const values: number[] = [11800, 6200, 3900, 1800, 682];
    const total: number = sum(values);
    const counts: number[] = allocateWaffleCells(values, 100);
    expect(sum(counts)).toBe(100);
    values.forEach((v, i) => {
      expect(Math.abs(counts[i]! - (v / total) * 100)).toBeLessThan(1);
    });
  });

  test("a total above the sum leaves the remainder unallocated", () => {
    expect(allocateWaffleCells([62, 22], 100, 100)).toEqual([62, 22]);
    expect(allocateWaffleCells([31, 11], 50, 100)).toEqual([16, 5]);
  });

  test("a total below the sum is ignored", () => {
    expect(allocateWaffleCells([30, 70], 10, 50)).toEqual([3, 7]);
  });

  test("zero, negative and non-finite values get no cells", () => {
    expect(allocateWaffleCells([0, -5, Number.NaN, 10], 20)).toEqual([
      0, 0, 0, 20,
    ]);
  });

  test("empty data or no cells allocates nothing", () => {
    expect(allocateWaffleCells([], 100)).toEqual([]);
    expect(allocateWaffleCells([0, 0], 100)).toEqual([0, 0]);
    expect(allocateWaffleCells([5, 5], 0)).toEqual([0, 0]);
  });
});
