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
import { toggleExcluded } from "#/lib/exclude-value";
import type { DashboardSearch } from "#/lib/schemas/transactions";

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

	function handleToggle(type: TransactionType, checked: boolean) {
		const next = checked
			? [...(value ?? []), type]
			: (value ?? []).filter((x) => x !== type);
		const nextExcluded = (excluded ?? []).filter((x) => x !== type);
		onChange({
			type: next.length ? next : undefined,
			excludeType: nextExcluded.length ? nextExcluded : undefined,
		});
	}

	function handleExclude(type: TransactionType) {
		const r = toggleExcluded(value, excluded, type);
		onChange({ type: r.included, excludeType: r.excluded });
	}

	const parts: string[] = [];
	if (value?.length)
		parts.push(
			value.length === 1
				? value[0]
				: typeFilterContent.countLabel(value.length),
		);
	if (excluded?.length)
		parts.push(`−${excluded.length === 1 ? excluded[0] : excluded.length}`);
	const label = parts.length ? parts.join(", ") : typeFilterContent.anyLabel;

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
					<span className="truncate">{label}</span>
					<CaretDownIcon data-icon="inline-end" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-56">
					{TRANSACTION_TYPES.map((type) => (
						<DropdownMenuCheckboxItem
							key={type}
							checked={value?.includes(type) ?? false}
							onCheckedChange={(checked) => handleToggle(type, checked)}
							closeOnClick={false}
							onContextMenu={(e) => {
								e.preventDefault();
								handleExclude(type);
							}}
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
