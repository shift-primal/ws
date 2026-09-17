import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { getTransactionsColumnLabels } from "#/content";

export const dateColumn = columnHelper.accessor("date", {
	header: ({ table }) => (
		<SortableHeader
			label={getTransactionsColumnLabels().date}
			column="date"
			meta={table.options.meta}
		/>
	),
});
