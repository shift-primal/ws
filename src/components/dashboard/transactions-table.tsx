import { useTable } from "@tanstack/react-table";
import { Button } from "#/components/shadcn/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/shadcn/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/shadcn/ui/table";
import type { DbTransaction } from "#/db/schema";
import {
	columns,
	type DashboardTableMeta,
	tableFeatureSet,
} from "./transactions-table/columns";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

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
				<CardTitle>Transactions</CardTitle>
			</CardHeader>
			<CardContent className="min-h-0 grow overflow-y-auto">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-card">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : (
											<table.FlexRender header={header} />
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length === 0 && (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									No transactions.
								</TableCell>
							</TableRow>
						)}
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getAllCells().map((cell) => (
									<TableCell key={cell.id}>
										<table.FlexRender cell={cell} />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter className="shrink-0 flex-col gap-3 sm:grid sm:grid-cols-3">
				<div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs sm:justify-start">
					<span>Rows per page</span>
					<Select
						value={String(pagination.pageSize)}
						onValueChange={(value) =>
							pagination.onPageSizeChange(Number(value))
						}
					>
						<SelectTrigger size="sm" className="min-w-15">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZE_OPTIONS.map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={pagination.page <= 1}
						onClick={pagination.onPrevious}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={pagination.page >= pagination.totalPages}
						onClick={pagination.onNext}
					>
						Next
					</Button>
				</div>

				<span className="text-center text-muted-foreground text-xs sm:text-right">
					Page {pagination.page} of {pagination.totalPages} ·{" "}
					{pagination.totalResults} total
				</span>
			</CardFooter>
		</Card>
	);
}
