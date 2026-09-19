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
	getDemoLockedHintContent,
	getExcludeHintContent,
} from "#/content";
import { useIsDemoAccount } from "#/lib/hooks/use-is-demo-account";
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
	const isDemo = useIsDemoAccount();
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
	});

	return (
		<Select
			value={category}
			// Demo accounts share seeded data, so the dropdown is locked; a
			// controlled-closed Select (rather than `disabled`) keeps
			// right-click / long-press exclusion working.
			{...(isDemo && {
				open: false,
				onOpenChange: (open: boolean) => {
					if (open)
						toast.add({
							type: "info",
							title: getDemoLockedHintContent().text,
						});
				},
			})}
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
