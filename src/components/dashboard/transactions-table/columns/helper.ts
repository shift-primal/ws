import { createColumnHelper, tableFeatures } from "@tanstack/react-table";
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

export const columnHelper = createColumnHelper<
	typeof tableFeatureSet,
	DbTransaction
>();
