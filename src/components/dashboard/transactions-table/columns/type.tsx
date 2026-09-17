import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { Badge } from "#/components/shadcn/ui/badge";
import { getTransactionsColumnLabels } from "#/content";
import { TYPE_ICONS } from "#/lib/icons";

export const typeColumn = columnHelper.accessor("type", {
	header: ({ table }) => (
		<SortableHeader
			label={getTransactionsColumnLabels().type}
			column="type"
			meta={table.options.meta}
		/>
	),
	cell: ({ row }) => {
		const TypeIcon = TYPE_ICONS[row.original.type];
		return (
			<Badge variant="secondary">
				<TypeIcon /> {row.original.type}
			</Badge>
		);
	},
});
