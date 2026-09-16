export type AmountBounds = { minBound: number; maxBound: number };

function negBoundOf({ minBound }: AmountBounds) {
	return Math.min(minBound, 0);
}

function posBoundOf({ maxBound }: AmountBounds) {
	return Math.max(maxBound, 0);
}

/**
 * Maps a signed amount to a bipolar slider position in [-1, 1]. The negative
 * and positive sides are scaled independently against their own bound so
 * both halves of the slider use their full range even when the underlying
 * amounts are lopsided (e.g. few large expenses, many small income entries).
 */
export function amountToPosition(amount: number, bounds: AmountBounds) {
	const negBound = negBoundOf(bounds);
	if (amount <= 0) return negBound === 0 ? 0 : amount / -negBound;

	const posBound = posBoundOf(bounds);
	return posBound === 0 ? 0 : amount / posBound;
}

export function positionToAmount(position: number, bounds: AmountBounds) {
	return position <= 0
		? position * -negBoundOf(bounds)
		: position * posBoundOf(bounds);
}
