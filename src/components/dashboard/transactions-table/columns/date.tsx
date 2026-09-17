import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { TRANSACTIONS_COLUMN_LABELS } from "#/content";

export const dateColumn = columnHelper.accessor("date", {
	header: ({ table }) => (
		<SortableHeader
			label={TRANSACTIONS_COLUMN_LABELS.date}
			column="date"
			meta={table.options.meta}
		/>
	),
});
