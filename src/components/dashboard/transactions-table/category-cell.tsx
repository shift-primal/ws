import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES, type Category } from "txcategorizer";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/shadcn/ui/select";
import { toast } from "#/components/shadcn/ui/toast";
import { getCategoryCellContent } from "#/content";
import { CATEGORY_ICONS } from "#/lib/icons";
import { setTransactionCategory } from "#/server/functions/transactions";

export const CategoryCell = ({
	id,
	category,
}: {
	id: number;
	category: Category;
}) => {
	const categoryCellContent = getCategoryCellContent();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: (next: Category) =>
			setTransactionCategory({ data: { id, category: next } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.add({
				type: "success",
				title: categoryCellContent.successToastTitle,
			});
		},
	});

	return (
		<Select
			value={category}
			onValueChange={(value) => {
				if (value !== category) mutate(value as Category);
			}}
		>
			<SelectTrigger size="sm" className="rounded-full">
				<SelectValue>
					{(value: Category) => {
						const CategoryIcon = CATEGORY_ICONS[value];
						return (
							<>
								<CategoryIcon />
								{value}
							</>
						);
					}}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{CATEGORIES.map((c) => {
					const Icon = CATEGORY_ICONS[c];
					return (
						<SelectItem key={c} value={c}>
							<Icon />
							{c}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};
