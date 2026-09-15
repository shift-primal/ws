import { createColumnHelper, tableFeatures } from "@tanstack/react-table";
import { Badge } from "#/components/shadcn/ui/badge";
import { Button } from "#/components/shadcn/ui/button";
import type { DbTransaction } from "#/db/schema";
import type { TransactionQuery } from "#/lib/schemas/transactions";

export type SortableColumn = NonNullable<TransactionQuery["sortBy"]>;

export type DashboardTableMeta = {
	sortBy?: TransactionQuery["sortBy"];
	sortDir?: TransactionQuery["sortDir"];
	onSort: (column: SortableColumn) => void;
};

export const tableFeatureSet = tableFeatures({
	tableMeta: {} as DashboardTableMeta,
});

const columnHelper = createColumnHelper<
	typeof tableFeatureSet,
	DbTransaction
>();

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
	style: "currency",
	currency: "NOK",
});

function SortableHeader({
	label,
	column,
	meta,
}: {
	label: string;
	column: SortableColumn;
	meta: DashboardTableMeta | undefined;
}) {
	const isActive = meta?.sortBy === column;

	return (
		<Button
			variant="ghost"
			size="sm"
			className="-ml-2.5"
			onClick={() => meta?.onSort(column)}
		>
			{label}
			{isActive ? (meta?.sortDir === "asc" ? " ↑" : " ↓") : ""}
		</Button>
	);
}

export const columns = columnHelper.columns([
	columnHelper.accessor("date", {
		header: ({ table }) => (
			<SortableHeader label="Date" column="date" meta={table.options.meta} />
		),
	}),
	columnHelper.accessor("merchant", {
		header: ({ table }) => (
			<SortableHeader
				label="Merchant"
				column="merchant"
				meta={table.options.meta}
			/>
		),
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span>{row.original.merchant}</span>
				{row.original.counterparty && (
					<span className="text-muted-foreground text-xs">
						{row.original.counterparty}
					</span>
				)}
			</div>
		),
	}),
	columnHelper.accessor("category", {
		header: ({ table }) => (
			<SortableHeader
				label="Category"
				column="category"
				meta={table.options.meta}
			/>
		),
		cell: ({ row }) => (
			<Badge variant="secondary">{row.original.category}</Badge>
		),
	}),
	columnHelper.accessor("type", { header: "Type" }),
	columnHelper.accessor("amount", {
		header: ({ table }) => (
			<SortableHeader
				label="Amount"
				column="amount"
				meta={table.options.meta}
			/>
		),
		cell: ({ row }) => {
			const amount = Number(row.original.amount);
			return (
				<span className={amount < 0 ? "text-destructive" : "text-emerald-600"}>
					{currencyFormatter.format(amount)}
				</span>
			);
		},
	}),
]);
