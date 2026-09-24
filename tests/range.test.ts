import { describe, expect, it } from "vitest";
import {
  alignPriceToTickSpacing,
  calculateCounterpartAmount,
  deriveFrameHealth,
  deriveTokenComposition,
  priceToDisplayTick
} from "@/lib/range";

describe("range frame calculations", () => {
  it("derives objective frame health without investment scoring", () => {
    const health = deriveFrameHealth({
      currentPrice: 184.26,
      lowerPrice: 172,
      upperPrice: 198.5
    });

    expect(health.state).toBe("IN_RANGE");
    expect(health.distanceToLowerPct).toBeCloseTo(6.65, 2);
    expect(health.distanceToUpperPct).toBeCloseTo(7.73, 2);
    expect(health.label).toBe("IN RANGE");
  });

  it("aligns display prices to the nearest tick spacing", () => {
    expect(alignPriceToTickSpacing(172.037, 0.05)).toBe(172.05);
    expect(alignPriceToTickSpacing(198.481, 0.05)).toBe(198.5);
  });

  it("derives a balanced in-range token composition from relative price location", () => {
    const composition = deriveTokenComposition({
      currentPrice: 184.26,
      lowerPrice: 172,
      upperPrice: 198.5
    });

    expect(composition.tokenA).toBe(54);
    expect(composition.tokenB).toBe(46);
  });

  it("calculates quote counterpart and display tick values", () => {
    expect(calculateCounterpartAmount(2.5, 184.26)).toBe(460.65);
    expect(priceToDisplayTick(184.26, 10)).toBe(1843);
  });
});
