import { CaretDownIcon, MinusIcon } from "@phosphor-icons/react";
import { TRANSACTION_TYPES, type TransactionType } from "txcategorizer";
import { Button } from "#/components/shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "#/components/shadcn/ui/dropdown-menu";
import { Field, FieldLabel } from "#/components/shadcn/ui/field";
import { getTypeFilterContent } from "#/content";
import { cycleFilterValue } from "#/lib/exclude-value";
import type { DashboardSearch } from "#/lib/schemas/transactions";
import { FilterTriggerLabel } from "./filter-trigger-label";

export function TypeFilter({
	value,
	excluded,
	onChange,
}: {
	value: TransactionType[] | undefined;
	excluded: TransactionType[] | undefined;
	onChange: (patch: Partial<DashboardSearch>) => void;
}) {
	const typeFilterContent = getTypeFilterContent();

	function handleCycle(type: TransactionType) {
		const r = cycleFilterValue(value, excluded, type);
		onChange({ type: r.included, excludeType: r.excluded });
	}

	return (
		<Field className="w-full sm:w-56">
			<FieldLabel htmlFor="type-filter">{typeFilterContent.label}</FieldLabel>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="outline"
							id="type-filter"
							className="justify-between px-2.5 font-normal"
						/>
					}
				>
					<FilterTriggerLabel
						included={value}
						excluded={excluded}
						anyLabel={typeFilterContent.anyLabel}
					/>
					<CaretDownIcon data-icon="inline-end" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-56">
					{TRANSACTION_TYPES.map((type) => (
						<DropdownMenuCheckboxItem
							key={type}
							checked={value?.includes(type) ?? false}
							onCheckedChange={() => handleCycle(type)}
							closeOnClick={false}
						>
							{type}
							{excluded?.includes(type) && (
								<MinusIcon className="pointer-events-none absolute right-2" />
							)}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</Field>
	);
}
