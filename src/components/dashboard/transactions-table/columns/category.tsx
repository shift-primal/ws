import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { Badge } from "#/components/shadcn/ui/badge";
import { getTransactionsColumnLabels } from "#/content";
import { CATEGORY_ICONS } from "#/lib/icons";

export const categoryColumn = columnHelper.accessor("category", {
	header: ({ table }) => (
		<SortableHeader
			label={getTransactionsColumnLabels().category}
			column="category"
			meta={table.options.meta}
		/>
	),
	cell: ({ row }) => {
		const CategoryIcon = CATEGORY_ICONS[row.original.category];
		return (
			<Badge variant="secondary">
				<CategoryIcon />
				{row.original.category}
			</Badge>
		);
	},
});
