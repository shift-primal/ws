import { useTable } from "@tanstack/react-table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import { getTransactionsTableContent } from "#/content";
import type { DbTransaction } from "#/db/schema";
import { useMediaQuery } from "#/lib/hooks/use-media-query";
import {
	columns,
	type DashboardTableMeta,
	tableFeatureSet,
} from "./transactions-table/columns";
import { TransactionsTableFooter } from "./transactions-table/footer";
import { TransactionsTableMobileList } from "./transactions-table/mobile-list";
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
	const isMobile = useMediaQuery("(max-width: 767px)");

	return (
		<Card>
			<CardHeader className="shrink-0">
				<CardTitle>{getTransactionsTableContent().title}</CardTitle>
			</CardHeader>
			<CardContent>
				{isMobile ? (
					<TransactionsTableMobileList
						data={data}
						onExcludeCategory={meta.onExcludeCategory}
						onExcludeType={meta.onExcludeType}
					/>
				) : (
					<TransactionsTableContent table={table} />
				)}
			</CardContent>
			<TransactionsTableFooter pagination={pagination} />
		</Card>
	);
}
