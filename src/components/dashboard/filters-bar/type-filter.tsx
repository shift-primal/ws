import { CaretDownIcon } from "@phosphor-icons/react";
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

export function TypeFilter({
	value,
	onChange,
}: {
	value: TransactionType[] | undefined;
	onChange: (types: TransactionType[] | undefined) => void;
}) {
	const typeFilterContent = getTypeFilterContent();

	function handleToggle(type: TransactionType, checked: boolean) {
		const next = checked
			? [...(value ?? []), type]
			: (value ?? []).filter((t) => t !== type);
		onChange(next.length ? next : undefined);
	}

	const label =
		!value || value.length === 0
			? typeFilterContent.anyLabel
			: value.length === 1
				? value[0]
				: typeFilterContent.countLabel(value.length);

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
						>
							{type}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</Field>
	);
}
