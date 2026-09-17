import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { getTransactionsColumnLabels } from "#/content";

export const merchantColumn = columnHelper.accessor("merchant", {
	header: ({ table }) => (
		<SortableHeader
			label={getTransactionsColumnLabels().merchant}
			column="merchant"
			meta={table.options.meta}
		/>
	),
	cell: ({ row }) => (
		<div className="flex flex-col">
			<span>{row.original.merchant}</span>
			<span className="text-muted-foreground text-xs">
				{row.original.counterparty || " "}
			</span>
		</div>
	),
});
