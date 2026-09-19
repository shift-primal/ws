import { createColumnHelper, tableFeatures } from "@tanstack/react-table";
import type { Category, TransactionType } from "txcategorizer";
import type { DbTransaction } from "#/db/schema";
import type { TransactionQuery } from "#/lib/schemas/transactions";

export type SortableColumn = NonNullable<TransactionQuery["sortBy"]>;

export type DashboardTableMeta = {
	sortBy?: TransactionQuery["sortBy"];
	sortDir?: TransactionQuery["sortDir"];
	onSort: (column: SortableColumn) => void;
	onExcludeCategory: (category: Category) => void;
	onExcludeType: (type: TransactionType) => void;
};

export const tableFeatureSet = tableFeatures({
	tableMeta: {} as DashboardTableMeta,
});

export const columnHelper = createColumnHelper<
	typeof tableFeatureSet,
	DbTransaction
>();
