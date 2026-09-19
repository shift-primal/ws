import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { Button } from "#/components/shadcn/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/shadcn/ui/tooltip";
import { getExcludeHintContent, getTransactionsColumnLabels } from "#/content";
import { TYPE_ICONS } from "#/lib/icons";

export const typeColumn = columnHelper.accessor("type", {
	header: ({ table }) => (
		<SortableHeader
			label={getTransactionsColumnLabels().type}
			column="type"
			meta={table.options.meta}
		/>
	),
	cell: ({ row, table }) => {
		const TypeIcon = TYPE_ICONS[row.original.type];
		return (
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							size="sm"
							variant="outline"
							onContextMenu={(e) => {
								e.preventDefault();
								table.options.meta?.onExcludeType(row.original.type);
							}}
						/>
					}
				>
					<TypeIcon /> {row.original.type}
				</TooltipTrigger>
				<TooltipContent>{getExcludeHintContent().text}</TooltipContent>
			</Tooltip>
		);
	},
});
