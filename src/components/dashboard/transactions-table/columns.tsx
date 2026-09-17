import { amountColumn } from "#/components/dashboard/transactions-table/columns/amount";
import { categoryColumn } from "#/components/dashboard/transactions-table/columns/category";
import { dateColumn } from "#/components/dashboard/transactions-table/columns/date";
import { deleteColumn } from "#/components/dashboard/transactions-table/columns/delete";
import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { merchantColumn } from "#/components/dashboard/transactions-table/columns/merchant";
import { typeColumn } from "#/components/dashboard/transactions-table/columns/type";

export type {
	DashboardTableMeta,
	SortableColumn,
} from "#/components/dashboard/transactions-table/columns/helper";
export { tableFeatureSet } from "#/components/dashboard/transactions-table/columns/helper";

export const columns = columnHelper.columns([
	dateColumn,
	merchantColumn,
	categoryColumn,
	typeColumn,
	amountColumn,
	deleteColumn,
]);
