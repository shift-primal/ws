import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { SortableHeader } from "#/components/dashboard/transactions-table/columns/sortable-header";
import { Badge } from "#/components/shadcn/ui/badge";
import { getTransactionsColumnLabels } from "#/content";
import { fmtCurrency, fmtExchangeRate } from "#/lib/fmt";
import { CURRENCY_SYMBOLS } from "#/lib/symbols";
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
		const { currency, exchangeRate } = row.original;
		return (
			<div className="flex flex-col items-start gap-1">
				<span className={colorClasses[signColor(amount)]}>
					{fmtCurrency(amount)}
				</span>
				{currency && exchangeRate && (
					<Badge variant="ghost" className="text-[0.6rem]">
						{CURRENCY_SYMBOLS[currency] ?? ""} {currency} (
						{fmtExchangeRate(exchangeRate)})
					</Badge>
				)}
			</div>
		);
	},
});
