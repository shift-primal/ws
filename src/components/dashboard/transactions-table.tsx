import { useTable } from "@tanstack/react-table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import { getTransactionsTableContent } from "#/content";
import type { DbTransaction } from "#/db/schema";
import {
	columns,
	type DashboardTableMeta,
	tableFeatureSet,
} from "./transactions-table/columns";
import { TransactionsTableFooter } from "./transactions-table/footer";
import { TransactionsTableContent } from "./transactions-table/table";

export type TransactionsTablePagination = {
	page: number;
	pageSize: number;
	totalPages: number;
	totalResults: number;
	onPrevious: () => void;
	onNext: () => void;
	onPageSizeChange: (pageSize: number) => void;
};

export function TransactionsTable({
	data,
	meta,
	pagination,
}: {
	data: DbTransaction[];
	meta: DashboardTableMeta;
	pagination: TransactionsTablePagination;
}) {
	const table = useTable({
		features: tableFeatureSet,
		columns,
		data,
		meta,
	});

	return (
		<Card className="min-h-104 flex-1">
			<CardHeader className="shrink-0">
				<CardTitle>{getTransactionsTableContent().title}</CardTitle>
			</CardHeader>
			<CardContent className="min-h-0 grow overflow-y-auto">
				<TransactionsTableContent table={table} />
			</CardContent>
			<TransactionsTableFooter pagination={pagination} />
		</Card>
	);
}
