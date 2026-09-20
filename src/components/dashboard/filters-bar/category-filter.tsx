import { CaretDownIcon, MinusIcon } from "@phosphor-icons/react";
import { CATEGORIES, type Category } from "txcategorizer";
import { Button } from "#/components/shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "#/components/shadcn/ui/dropdown-menu";
import { Field, FieldLabel } from "#/components/shadcn/ui/field";
import { getCategoryFilterContent } from "#/content";
import { cycleFilterValue } from "#/lib/exclude-value";
import type { DashboardSearch } from "#/lib/schemas/transactions";
import { FilterTriggerLabel } from "./filter-trigger-label";

export function CategoryFilter({
	value,
	excluded,
	onChange,
}: {
	value: Category[] | undefined;
	excluded: Category[] | undefined;
	onChange: (patch: Partial<DashboardSearch>) => void;
}) {
	const categoryFilterContent = getCategoryFilterContent();

	function handleCycle(category: Category) {
		const r = cycleFilterValue(value, excluded, category);
		onChange({ category: r.included, excludeCategory: r.excluded });
	}

	return (
		<Field className="w-full sm:w-56">
			<FieldLabel htmlFor="category-filter">
				{categoryFilterContent.label}
			</FieldLabel>
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
					<FilterTriggerLabel
						included={value}
						excluded={excluded}
						anyLabel={categoryFilterContent.anyLabel}
					/>
					<CaretDownIcon data-icon="inline-end" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-56">
					{CATEGORIES.map((category) => (
						<DropdownMenuCheckboxItem
							key={category}
							checked={value?.includes(category) ?? false}
							onCheckedChange={() => handleCycle(category)}
							closeOnClick={false}
						>
							{category}
							{excluded?.includes(category) && (
								<MinusIcon className="pointer-events-none absolute right-2" />
							)}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</Field>
	);
}
