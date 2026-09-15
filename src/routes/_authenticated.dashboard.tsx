import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import type { SortableColumn } from "#/components/dashboard/columns";
import { StatCards } from "#/components/dashboard/stat-cards";
import { TransactionsTable } from "#/components/dashboard/transactions-table";
import { Button } from "#/components/shadcn/ui/button";
import { transactionsQuery } from "#/lib/queries/transactions";
import { transactionQuerySchema } from "#/lib/schemas/transactions";

export const Route = createFileRoute("/_authenticated/dashboard")({
	validateSearch: transactionQuerySchema,
	search: {
		middlewares: [stripSearchParams({ page: 1, pageSize: 25 })],
	},
	loaderDeps: ({ search }) => search,
	loader: ({ context: { queryClient }, deps }) =>
		queryClient.ensureQueryData(transactionsQuery(deps)),
	component: Dashboard,
});

function Dashboard() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data } = useSuspenseQuery(transactionsQuery(search));

	const totalPages = Math.max(
		1,
		Math.ceil(data.totalResults / search.pageSize),
	);

	function handleSort(column: SortableColumn) {
		navigate({
			search: (prev) => ({
				...prev,
				sortBy: column,
				sortDir:
					prev.sortBy === column && prev.sortDir === "asc" ? "desc" : "asc",
				page: 1,
			}),
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<StatCards
				totalIn={data.totalIn}
				totalOut={data.totalOut}
				totalResults={data.totalResults}
			/>

			<TransactionsTable
				data={data.data}
				meta={{
					sortBy: search.sortBy,
					sortDir: search.sortDir,
					onSort: handleSort,
				}}
			/>

			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-sm">
					Page {search.page} of {totalPages} · {data.totalResults} total
				</span>

				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={search.page <= 1}
						onClick={() =>
							navigate({
								search: (prev) => ({ ...prev, page: prev.page - 1 }),
							})
						}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={search.page >= totalPages}
						onClick={() =>
							navigate({
								search: (prev) => ({ ...prev, page: prev.page + 1 }),
							})
						}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
