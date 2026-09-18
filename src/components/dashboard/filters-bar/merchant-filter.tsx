import { useEffect } from "react";
import { Field, FieldLabel } from "#/components/shadcn/ui/field";
import { Input } from "#/components/shadcn/ui/input";
import { getMerchantFilterContent } from "#/content";
import { useResettableState } from "#/lib/hooks/use-resettable-state";

export function MerchantFilter({
	value,
	onChange,
}: {
	value: string | undefined;
	onChange: (merchant: string | undefined) => void;
}) {
	const merchantFilterContent = getMerchantFilterContent();
	const [merchant, setMerchant] = useResettableState(value ?? "", value);

	useEffect(() => {
		if (merchant === (value ?? "")) return;

		const handle = setTimeout(() => {
			onChange(merchant || undefined);
		}, 300);

		return () => clearTimeout(handle);
	}, [merchant, value, onChange]);

	return (
		<Field className="w-full sm:w-xs">
			<FieldLabel htmlFor="merchant-filter">
				{merchantFilterContent.label}
			</FieldLabel>
			<Input
				id="merchant-filter"
				placeholder={merchantFilterContent.placeholder}
				value={merchant}
				onChange={(event) => setMerchant(event.target.value)}
			/>
		</Field>
	);
}
