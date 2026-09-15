import { CalendarBlankIcon, CaretDownIcon, XIcon } from "@phosphor-icons/react";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { CATEGORIES, type Category } from "txcategorizer";
import { Button } from "#/components/shadcn/ui/button";
import { Calendar } from "#/components/shadcn/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "#/components/shadcn/ui/dropdown-menu";
import { Field, FieldLabel } from "#/components/shadcn/ui/field";
import { Input } from "#/components/shadcn/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/shadcn/ui/popover";
import { Slider } from "#/components/shadcn/ui/slider";
import { formatCurrency } from "#/lib/currency";
import type { DashboardSearch } from "#/lib/schemas/transactions";

export function FiltersBar({
	search,
	bounds,
	onChange,
}: {
	search: DashboardSearch;
	bounds: { minBound: number; maxBound: number };
	onChange: (patch: Partial<DashboardSearch>) => void;
}) {
	// The slider's own domain is a fixed [-1, 1] "position" space rather than
	// the raw kr amounts, so that 0 always renders at the visual midpoint and
	// each half independently stretches to fill it: [-1, 0] maps to
	// [negBound, 0] and [0, 1] maps to [0, posBound].
	const negBound = Math.min(bounds.minBound, 0);
	const posBound = Math.max(bounds.maxBound, 0);

	function amountToPosition(amount: number) {
		if (amount <= 0) return negBound === 0 ? 0 : amount / -negBound;
		return posBound === 0 ? 0 : amount / posBound;
	}

	function positionToAmount(position: number) {
		return position <= 0 ? position * -negBound : position * posBound;
	}

	// Local "draft" state for controls that need to feel responsive while the
	// user is actively interacting (typing, dragging) before a debounced or
	// committed value reaches the URL. When `search` changes for a reason
	// other than our own draft (Reset filters, browser back/forward), these
	// need to snap back in sync — done here during render (React's
	// recommended replacement for a "sync state to a prop" effect, see
	// https://react.dev/learn/you-might-not-need-an-effect) rather than via
	// an effect, since it skips an extra render and can't miss a dependency.
	const [prevMerchant, setPrevMerchant] = useState(search.merchant);
	const [merchant, setMerchant] = useState(search.merchant ?? "");
	if (search.merchant !== prevMerchant) {
		setPrevMerchant(search.merchant);
		setMerchant(search.merchant ?? "");
	}

	const amountKey = `${search.minAmt}:${search.maxAmt}:${bounds.minBound}:${bounds.maxBound}`;
	const [prevAmountKey, setPrevAmountKey] = useState(amountKey);
	const [amountRange, setAmountRange] = useState<[number, number]>([
		search.minAmt ?? bounds.minBound,
		search.maxAmt ?? bounds.maxBound,
	]);
	if (amountKey !== prevAmountKey) {
		setPrevAmountKey(amountKey);
		setAmountRange([
			search.minAmt ?? bounds.minBound,
			search.maxAmt ?? bounds.maxBound,
		]);
	}

	// Debouncing genuinely needs an effect: "wait 300ms, then fire" requires
	// setTimeout + cleanup, which has no render-time equivalent.
	useEffect(() => {
		if (merchant === (search.merchant ?? "")) return;

		const handle = setTimeout(() => {
			onChange({ merchant: merchant || undefined });
		}, 300);

		return () => clearTimeout(handle);
	}, [merchant, search.merchant, onChange]);

	const hasActiveFilters =
		search.from !== undefined ||
		search.to !== undefined ||
		search.category !== undefined ||
		search.merchant !== undefined ||
		search.minAmt !== undefined ||
		search.maxAmt !== undefined;

	function handleReset() {
		onChange({
			from: undefined,
			to: undefined,
			category: undefined,
			merchant: undefined,
			minAmt: undefined,
			maxAmt: undefined,
		});
	}

	const dateRange: DateRange | undefined = search.from
		? {
				from: parseISO(search.from),
				to: search.to ? parseISO(search.to) : undefined,
			}
		: undefined;

	function handleDateRangeChange(range: DateRange | undefined) {
		onChange({
			from: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
			to: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
		});
	}

	function handleCategoryToggle(category: Category, checked: boolean) {
		const next = checked
			? [...(search.category ?? []), category]
			: (search.category ?? []).filter((c) => c !== category);
		onChange({ category: next.length ? next : undefined });
	}

	const categoryLabel =
		!search.category || search.category.length === 0
			? "Any category"
			: search.category.length === 1
				? search.category[0]
				: `${search.category.length} categories`;

	return (
		<div className="flex flex-wrap items-end gap-4">
			<Field className="w-auto">
				<FieldLabel htmlFor="date-range-filter">Date range</FieldLabel>
				<div className="flex items-center gap-1">
					<Popover>
						<PopoverTrigger
							render={
								<Button
									variant="outline"
									id="date-range-filter"
									className="justify-start px-2.5 font-normal"
								/>
							}
						>
							<CalendarBlankIcon data-icon="inline-start" />
							{dateRange?.from ? (
								dateRange.to ? (
									<>
										{format(dateRange.from, "LLL dd, y")} –{" "}
										{format(dateRange.to, "LLL dd, y")}
									</>
								) : (
									format(dateRange.from, "LLL dd, y")
								)
							) : (
								<span>All time</span>
							)}
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="range"
								defaultMonth={dateRange?.from}
								selected={dateRange}
								onSelect={handleDateRangeChange}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>
					{dateRange?.from && (
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Clear date range"
							onClick={() => handleDateRangeChange(undefined)}
						>
							<XIcon />
						</Button>
					)}
				</div>
			</Field>

			<Field className="w-56">
				<FieldLabel htmlFor="category-filter">Category</FieldLabel>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="outline"
								id="category-filter"
								className="justify-between px-2.5 font-normal"
							/>
						}
					>
						<span className="truncate">{categoryLabel}</span>
						<CaretDownIcon data-icon="inline-end" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="min-w-56">
						{CATEGORIES.map((category) => (
							<DropdownMenuCheckboxItem
								key={category}
								checked={search.category?.includes(category) ?? false}
								onCheckedChange={(checked) =>
									handleCategoryToggle(category, checked)
								}
								closeOnClick={false}
							>
								{category}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</Field>

			<Field className="w-48">
				<FieldLabel htmlFor="merchant-filter">Merchant</FieldLabel>
				<Input
					id="merchant-filter"
					placeholder="Search merchant..."
					value={merchant}
					onChange={(event) => setMerchant(event.target.value)}
				/>
			</Field>

			<Field className="w-64">
				<FieldLabel>
					Amount: {formatCurrency(amountRange[0])} –{" "}
					{formatCurrency(amountRange[1])}
				</FieldLabel>
				<Slider
					value={[
						amountToPosition(amountRange[0]),
						amountToPosition(amountRange[1]),
					]}
					onValueChange={(next) => {
						const [minPos, maxPos] = next as [number, number];
						setAmountRange([
							Math.round(positionToAmount(minPos)),
							Math.round(positionToAmount(maxPos)),
						]);
					}}
					onValueCommitted={(next) => {
						const [minPos, maxPos] = next as [number, number];
						const min = Math.round(positionToAmount(minPos));
						const max = Math.round(positionToAmount(maxPos));
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
						afterClassName: "bg-emerald-500",
					}}
				/>
			</Field>

			<Button
				variant="ghost"
				size="sm"
				disabled={!hasActiveFilters}
				onClick={handleReset}
			>
				Reset filters
			</Button>
		</div>
	);
}
