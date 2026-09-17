import type { ReactTable } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/shadcn/ui/table";
import { TRANSACTIONS_TABLE_CONTENT } from "#/content";
import type { DbTransaction } from "#/db/schema";
import type { tableFeatureSet } from "./columns";

export function TransactionsTableContent({
	table,
}: {
	table: ReactTable<typeof tableFeatureSet, DbTransaction>;
}) {
	const columnCount = table.getAllColumns().length;

	return (
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
						<TableCell colSpan={columnCount} className="text-center">
							{TRANSACTIONS_TABLE_CONTENT.emptyText}
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
	);
}
