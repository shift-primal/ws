import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { getTransactionsColumnLabels } from "#/content";
import { fmtCurrency } from "#/lib/fmt";
import { colorClasses, signColor } from "#/lib/utils";

export const amountColumn = columnHelper.accessor("amount", {
	header: ({ table }) => (
		<SortableHeader
			label={getTransactionsColumnLabels().amount}
			column="amount"
			meta={table.options.meta}
		/>
	),
	cell: ({ row }) => {
		const amount = Number(row.original.amount);
		return (
			<span className={colorClasses[signColor(amount)]}>
				{fmtCurrency(amount)}
			</span>
		);
	},
});
