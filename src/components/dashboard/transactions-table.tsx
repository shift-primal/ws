import { useTable } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/shadcn/ui/table";
import type { DbTransaction } from "#/db/schema";
import { columns, type DashboardTableMeta, tableFeatureSet } from "./columns";

export function TransactionsTable({
	data,
	meta,
}: {
	data: DbTransaction[];
	meta: DashboardTableMeta;
}) {
	const table = useTable({
		features: tableFeatureSet,
		columns,
		data,
		meta,
	});

	return (
		<Table>
			<TableHeader>
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
	);
}
