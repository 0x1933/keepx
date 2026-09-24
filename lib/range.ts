export type FrameState = "IN_RANGE" | "BELOW_RANGE" | "ABOVE_RANGE";

export type RangeInput = {
  currentPrice: number;
  lowerPrice: number;
  upperPrice: number;
};

export type FrameHealth = {
  state: FrameState;
  label: string;
  distanceToLowerPct: number;
  distanceToUpperPct: number;
  rangeWidthPct: number;
};

export type TokenComposition = {
  tokenA: number;
  tokenB: number;
};

const round = (value: number, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export function alignPriceToTickSpacing(price: number, tickPriceSpacing: number) {
  if (tickPriceSpacing <= 0) {
    throw new Error("Tick spacing must be greater than zero.");
  }

  return round(Math.round(price / tickPriceSpacing) * tickPriceSpacing, 8);
}

export function deriveFrameHealth(input: RangeInput): FrameHealth {
  validateRange(input);

  const { currentPrice, lowerPrice, upperPrice } = input;
  const state: FrameState =
    currentPrice < lowerPrice
      ? "BELOW_RANGE"
      : currentPrice > upperPrice
        ? "ABOVE_RANGE"
        : "IN_RANGE";

  return {
    state,
    label: state.replaceAll("_", " "),
    distanceToLowerPct: round(((currentPrice - lowerPrice) / currentPrice) * 100, 2),
    distanceToUpperPct: round(((upperPrice - currentPrice) / currentPrice) * 100, 2),
    rangeWidthPct: round(((upperPrice - lowerPrice) / currentPrice) * 100, 2)
  };
}

export function deriveTokenComposition(input: RangeInput): TokenComposition {
  validateRange(input);

  const { currentPrice, lowerPrice, upperPrice } = input;

  if (currentPrice <= lowerPrice) {
    return { tokenA: 100, tokenB: 0 };
  }

  if (currentPrice >= upperPrice) {
    return { tokenA: 0, tokenB: 100 };
  }

  const pricePosition = (currentPrice - lowerPrice) / (upperPrice - lowerPrice);
  const tokenB = Math.round(pricePosition * 100);

  return {
    tokenA: 100 - tokenB,
    tokenB
  };
}

export function validateRange(input: RangeInput) {
  if (input.currentPrice <= 0 || input.lowerPrice <= 0 || input.upperPrice <= 0) {
    throw new Error("Prices must be greater than zero.");
  }

  if (input.lowerPrice >= input.upperPrice) {
    throw new Error("Lower price must be below upper price.");
  }
}

export function calculateCounterpartAmount(baseAmount: number, price: number) {
  if (baseAmount < 0 || price <= 0) {
    throw new Error("Amount and price must be valid.");
  }

  return round(baseAmount * price, 2);
}

export function priceToDisplayTick(price: number, tickSpacing: number) {
  return Math.round(price * tickSpacing);
}
