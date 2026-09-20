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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/shadcn/ui/tooltip";
import {
	getCategoryCellContent,
	getExcludeHintContent,
} from "#/content";
import { useLongPress } from "#/lib/hooks/use-long-press";
import { CATEGORY_ICONS } from "#/lib/icons";
import { setTransactionCategory } from "#/server/functions/transactions";

export const CategoryCell = ({
	id,
	category,
	onContextMenu,
	onLongPress,
}: {
	id: number;
	category: Category;
	onContextMenu?: (e: React.MouseEvent) => void;
	onLongPress?: () => void;
}) => {
	const longPress = useLongPress(() => onLongPress?.());
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
		onError: (error) => {
			toast.add({ type: "error", title: error.message });
		},
	});

	return (
		<Select
			value={category}
			onValueChange={(value) => {
				if (value !== category) mutate(value as Category);
			}}
		>
			<Tooltip>
				<TooltipTrigger
					render={
						<SelectTrigger
							size="sm"
							className="select-none rounded-full [-webkit-touch-callout:none]"
							{...(onLongPress ? longPress : {})}
							onContextMenu={(e) => {
								if (onLongPress) longPress.onContextMenu(e);
								onContextMenu?.(e);
							}}
						/>
					}
				>
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
				</TooltipTrigger>
				<TooltipContent variant="popover">
					{getExcludeHintContent().text}
				</TooltipContent>
			</Tooltip>
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
