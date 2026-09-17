import { columnHelper } from "#/components/dashboard/transactions-table/columns/helper";
import { DeleteRowButton } from "#/components/dashboard/transactions-table/delete-row-button";
import { DELETE_COLUMN_CONTENT } from "#/content";

export const deleteColumn = columnHelper.display({
	id: "delete",
	header: () => (
		<span className="sr-only">{DELETE_COLUMN_CONTENT.srHeader}</span>
	),
	cell: ({ row }) => <DeleteRowButton id={row.original.id} />,
});
