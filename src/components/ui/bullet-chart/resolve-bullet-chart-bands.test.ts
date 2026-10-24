/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";

import { resolveBulletChartBands } from "./resolve-bullet-chart-bands";

describe("resolveBulletChartBands", () => {
  test("splits the scale at each threshold and closes at max", () => {
    expect(resolveBulletChartBands([150, 225], 0, 300)).toEqual([
      { from: 0, to: 150 },
      { from: 150, to: 225 },
      { from: 225, to: 300 },
    ]);
  });

  test("no thresholds is a single band", () => {
    expect(resolveBulletChartBands([], 0, 100)).toEqual([{ from: 0, to: 100 }]);
  });

  test("sorts thresholds and drops duplicates", () => {
    expect(resolveBulletChartBands([60, 20, 60], 0, 100)).toEqual([
      { from: 0, to: 20 },
      { from: 20, to: 60 },
      { from: 60, to: 100 },
    ]);
  });

  test("ignores thresholds outside the scale or not finite", () => {
    expect(
      resolveBulletChartBands([-10, 0, 50, 100, 120, Number.NaN], 0, 100),
    ).toEqual([
      { from: 0, to: 50 },
      { from: 50, to: 100 },
    ]);
  });

  test("works on a negative minimum", () => {
    expect(resolveBulletChartBands([0], -50, 50)).toEqual([
      { from: -50, to: 0 },
      { from: 0, to: 50 },
    ]);
  });
});
