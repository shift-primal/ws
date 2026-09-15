import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { CategoryChart } from "#/components/dashboard/category-chart";
import type { SortableColumn } from "#/components/dashboard/columns";
import { FiltersBar } from "#/components/dashboard/filters-bar";
import { MonthlyChart } from "#/components/dashboard/monthly-chart";
import { StatCards } from "#/components/dashboard/stat-cards";
import { TransactionsTable } from "#/components/dashboard/transactions-table";
import { Button } from "#/components/shadcn/ui/button";
import {
	amtBoundsQuery,
	categoryStatsQuery,
	monthlyStatsQuery,
	transactionsQuery,
} from "#/lib/queries/transactions";
import {
	type DashboardSearch,
	dashboardSearchSchema,
	type TransactionQuery,
	today,
	twoYearsAgo,
} from "#/lib/schemas/transactions";

function withDateDefaults(search: DashboardSearch): TransactionQuery {
	return {
		...search,
		from: search.from ?? twoYearsAgo(),
		to: search.to ?? today(),
	};
}

export const Route = createFileRoute("/_authenticated/dashboard")({
	validateSearch: dashboardSearchSchema,
	search: {
		middlewares: [stripSearchParams({ page: 1, pageSize: 25 })],
	},
	loaderDeps: ({ search }) => search,
	loader: ({ context: { queryClient }, deps }) => {
		const query = withDateDefaults(deps);
		return Promise.all([
			queryClient.query({ ...transactionsQuery(query), staleTime: "static" }),
			queryClient.query({ ...amtBoundsQuery, staleTime: "static" }),
			queryClient.query({ ...categoryStatsQuery(query), staleTime: "static" }),
			queryClient.query({ ...monthlyStatsQuery(query), staleTime: "static" }),
		]);
	},
	component: Dashboard,
});

function Dashboard() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const query = withDateDefaults(search);
	const { data } = useSuspenseQuery(transactionsQuery(query));
	const { data: bounds } = useSuspenseQuery(amtBoundsQuery);
	const { data: categoryStats } = useSuspenseQuery(categoryStatsQuery(query));
	const { data: monthlyStats } = useSuspenseQuery(monthlyStatsQuery(query));

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
			replace: true,
		});
	}

	function handleFilterChange(patch: Partial<DashboardSearch>) {
		navigate({
			search: (prev) => ({ ...prev, ...patch, page: 1 }),
			replace: true,
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<FiltersBar
				search={search}
				bounds={bounds}
				onChange={handleFilterChange}
			/>

			<StatCards
				totalIn={data.totalIn}
				totalOut={data.totalOut}
				totalResults={data.totalResults}
			/>

			<div className="grid gap-4 md:grid-cols-3">
				<div className="md:col-span-2">
					<MonthlyChart data={monthlyStats} />
				</div>
				<CategoryChart data={categoryStats} />
			</div>

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
								replace: true,
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
								replace: true,
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
