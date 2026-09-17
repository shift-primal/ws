import { Field, FieldLabel } from "#/components/shadcn/ui/field";
import { Slider } from "#/components/shadcn/ui/slider";
import {
	type AmountBounds,
	amountToPosition,
	positionToAmount,
} from "#/lib/amount-range";
import { fmtCurrency } from "#/lib/fmt";
import { useResettableState } from "#/lib/hooks/use-resettable-state";

export function AmountRangeFilter({
	minAmt,
	maxAmt,
	bounds,
	onChange,
}: {
	minAmt: number | undefined;
	maxAmt: number | undefined;
	bounds: AmountBounds;
	onChange: (patch: {
		minAmt: number | undefined;
		maxAmt: number | undefined;
	}) => void;
}) {
	const key = `${minAmt}:${maxAmt}:${bounds.minBound}:${bounds.maxBound}`;
	const [amountRange, setAmountRange] = useResettableState<[number, number]>(
		[minAmt ?? bounds.minBound, maxAmt ?? bounds.maxBound],
		key,
	);

	return (
		<Field className="w-xs grow">
			<FieldLabel>
				Amount: {fmtCurrency(amountRange[0])} – {fmtCurrency(amountRange[1])}
			</FieldLabel>
			<div className="flex h-8 items-center">
				<Slider
					value={[
						amountToPosition(amountRange[0], bounds),
						amountToPosition(amountRange[1], bounds),
					]}
					onValueChange={(next) => {
						const [minPos, maxPos] = next as [number, number];
						setAmountRange([
							Math.round(positionToAmount(minPos, bounds)),
							Math.round(positionToAmount(maxPos, bounds)),
						]);
					}}
					onValueCommitted={(next) => {
						const [minPos, maxPos] = next as [number, number];
						const min = Math.round(positionToAmount(minPos, bounds));
						const max = Math.round(positionToAmount(maxPos, bounds));
						onChange({
							minAmt: Math.abs(min - bounds.minBound) < 1 ? undefined : min,
							maxAmt: Math.abs(max - bounds.maxBound) < 1 ? undefined : max,
						});
					}}
					min={-1}
					max={1}
					step={0.01}
					minStepsBetweenValues={5}
					indicatorSplit={{
						at: 0,
						beforeClassName: "bg-destructive",
						afterClassName: "bg-success",
					}}
				/>
			</div>
		</Field>
	);
}
