import { CaretDownIcon } from "@phosphor-icons/react";
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

export function CategoryFilter({
	value,
	onChange,
}: {
	value: Category[] | undefined;
	onChange: (categories: Category[] | undefined) => void;
}) {
	const categoryFilterContent = getCategoryFilterContent();

	function handleToggle(category: Category, checked: boolean) {
		const next = checked
			? [...(value ?? []), category]
			: (value ?? []).filter((c) => c !== category);
		onChange(next.length ? next : undefined);
	}

	const label =
		!value || value.length === 0
			? categoryFilterContent.anyLabel
			: value.length === 1
				? value[0]
				: categoryFilterContent.countLabel(value.length);

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
					<span className="truncate">{label}</span>
					<CaretDownIcon data-icon="inline-end" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-56">
					{CATEGORIES.map((category) => (
						<DropdownMenuCheckboxItem
							key={category}
							checked={value?.includes(category) ?? false}
							onCheckedChange={(checked) => handleToggle(category, checked)}
							closeOnClick={false}
						>
							{category}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</Field>
	);
}
