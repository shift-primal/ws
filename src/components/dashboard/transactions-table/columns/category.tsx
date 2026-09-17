import { CategoryCell } from "#/components/dashboard/transactions-table/category-cell";
import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { getTransactionsColumnLabels } from "#/content";

export const categoryColumn = columnHelper.accessor("category", {
	header: ({ table }) => (
		<SortableHeader
			label={getTransactionsColumnLabels().category}
			column="category"
			meta={table.options.meta}
		/>
	),
	cell: ({ row }) => (
		<CategoryCell id={row.original.id} category={row.original.category} />
	),
});
