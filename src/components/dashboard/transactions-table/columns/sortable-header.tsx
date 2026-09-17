import type {
	DashboardTableMeta,
	SortableColumn,
} from "#/components/dashboard/transactions-table/columns/helper";
import { Button } from "#/components/shadcn/ui/button";

export function SortableHeader({
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
