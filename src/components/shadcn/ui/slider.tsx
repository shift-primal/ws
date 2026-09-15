import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

function Slider({
	className,
	trackClassName,
	indicatorSplit,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderPrimitive.Root.Props & {
	trackClassName?: string;
	/**
	 * Renders the filled range as two independently colored segments split at
	 * a domain value (e.g. 0), instead of one solid `bg-primary` bar. Useful
	 * for a range slider where "below" and "above" a threshold have distinct
	 * meaning (e.g. negative vs. positive amounts).
	 */
	indicatorSplit?: {
		at: number;
		beforeClassName: string;
		afterClassName: string;
	};
}) {
	const _values = Array.isArray(value)
		? value
		: Array.isArray(defaultValue)
			? defaultValue
			: [min, max];

	const toPercent = (v: number) => ((v - min) / (max - min)) * 100;

	return (
		<SliderPrimitive.Root
			className={cn("data-horizontal:w-full data-vertical:h-full", className)}
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			thumbAlignment="edge"
			{...props}
		>
			<SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
				<SliderPrimitive.Track
					data-slot="slider-track"
					className={cn(
						"relative grow overflow-hidden rounded-none bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1",
						trackClassName,
					)}
				>
					{indicatorSplit && _values.length > 1 ? (
						<>
							<div
								data-slot="slider-range"
								className={cn(
									"absolute inset-y-0 select-none",
									indicatorSplit.beforeClassName,
								)}
								style={{
									insetInlineStart: `${toPercent(_values[0])}%`,
									width: `${Math.max(0, Math.min(toPercent(indicatorSplit.at), toPercent(_values[_values.length - 1])) - toPercent(_values[0]))}%`,
								}}
							/>
							<div
								data-slot="slider-range"
								className={cn(
									"absolute inset-y-0 select-none",
									indicatorSplit.afterClassName,
								)}
								style={{
									insetInlineStart: `${Math.max(toPercent(indicatorSplit.at), toPercent(_values[0]))}%`,
									width: `${Math.max(0, toPercent(_values[_values.length - 1]) - Math.max(toPercent(indicatorSplit.at), toPercent(_values[0])))}%`,
								}}
							/>
						</>
					) : (
						<SliderPrimitive.Indicator
							data-slot="slider-range"
							className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
						/>
					)}
				</SliderPrimitive.Track>
				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						data-slot="slider-thumb"
						key={index}
						className="relative block size-3 shrink-0 rounded-none border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-1 focus-visible:ring-1 focus-visible:outline-hidden active:ring-1 disabled:pointer-events-none disabled:opacity-50"
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
