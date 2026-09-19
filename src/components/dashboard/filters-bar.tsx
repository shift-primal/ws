import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { AmountRangeFilter } from "#/components/dashboard/filters-bar/amount-range-filter";
import { CategoryFilter } from "#/components/dashboard/filters-bar/category-filter";
import { DateRangeFilter } from "#/components/dashboard/filters-bar/date-range-filter";
import { MerchantFilter } from "#/components/dashboard/filters-bar/merchant-filter";
import { TypeFilter } from "#/components/dashboard/filters-bar/type-filter";
import { Button } from "#/components/shadcn/ui/button";
import { Card, CardContent } from "#/components/shadcn/ui/card";
import type { AmountBounds } from "#/lib/amount-range";
import type { DashboardSearch } from "#/lib/schemas/transactions";

export function FiltersBar({
	search,
	bounds,
	onChange,
}: {
	search: DashboardSearch;
	bounds: AmountBounds;
	onChange: (patch: Partial<DashboardSearch>) => void;
}) {
	const hasActiveFilters =
		search.from !== undefined ||
		search.to !== undefined ||
		search.category !== undefined ||
		search.type !== undefined ||
		search.excludeCategory !== undefined ||
		search.excludeType !== undefined ||
		search.merchant !== undefined ||
		search.minAmt !== undefined ||
		search.maxAmt !== undefined;

	function handleReset() {
		onChange({
			from: undefined,
			to: undefined,
			category: undefined,
			type: undefined,
			excludeCategory: undefined,
			excludeType: undefined,
			merchant: undefined,
			minAmt: undefined,
			maxAmt: undefined,
		});
	}

	return (
		<Card size="sm">
			<CardContent className="flex flex-col gap-4 py-2 sm:flex-row sm:flex-wrap sm:items-end">
				<DateRangeFilter
					from={search.from}
					to={search.to}
					onChange={onChange}
				/>

				<CategoryFilter
					value={search.category}
					excluded={search.excludeCategory}
					onChange={onChange}
				/>

				<TypeFilter
					value={search.type}
					excluded={search.excludeType}
					onChange={onChange}
				/>

				<MerchantFilter
					value={search.merchant}
					onChange={(merchant) => onChange({ merchant })}
				/>

				<div className="flex items-end gap-4 sm:grow">
					<AmountRangeFilter
						minAmt={search.minAmt}
						maxAmt={search.maxAmt}
						bounds={bounds}
						onChange={onChange}
					/>

					<Button
						variant="ghost"
						size="icon-lg"
						disabled={!hasActiveFilters}
						onClick={handleReset}
					>
						<ArrowCounterClockwiseIcon />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
