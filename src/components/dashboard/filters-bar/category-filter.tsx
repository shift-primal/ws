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
import { toggleExcluded } from "#/lib/exclude-value";
import type { DashboardSearch } from "#/lib/schemas/transactions";

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

	function handleToggle(category: Category, checked: boolean) {
		const next = checked
			? [...(value ?? []), category]
			: (value ?? []).filter((x) => x !== category);
		const nextExcluded = (excluded ?? []).filter((x) => x !== category);
		onChange({
			category: next.length ? next : undefined,
			excludeCategory: nextExcluded.length ? nextExcluded : undefined,
		});
	}

	function handleExclude(category: Category) {
		const r = toggleExcluded(value, excluded, category);
		onChange({ category: r.included, excludeCategory: r.excluded });
	}

	const parts: string[] = [];
	if (value?.length)
		parts.push(
			value.length === 1
				? value[0]
				: categoryFilterContent.countLabel(value.length),
		);
	if (excluded?.length)
		parts.push(`−${excluded.length === 1 ? excluded[0] : excluded.length}`);
	const label = parts.length
		? parts.join(", ")
		: categoryFilterContent.anyLabel;

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
							onContextMenu={(e) => {
								e.preventDefault();
								handleExclude(category);
							}}
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
