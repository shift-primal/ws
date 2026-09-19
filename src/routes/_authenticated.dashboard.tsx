import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { CategoryChart } from "#/components/dashboard/category-chart";
import { FiltersBar } from "#/components/dashboard/filters-bar";
import { MonthlyChart } from "#/components/dashboard/monthly-chart";
import { StatCards } from "#/components/dashboard/stat-cards";
import { TransactionsTable } from "#/components/dashboard/transactions-table";
import type { SortableColumn } from "#/components/dashboard/transactions-table/columns";
import { toggleExcluded } from "#/lib/exclude-value";
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

const Dashboard = () => {
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
			search: (prev) => {
				if (prev.sortBy === column && prev.sortDir === "desc") {
					return { ...prev, sortBy: undefined, sortDir: undefined, page: 1 };
				}
				return {
					...prev,
					sortBy: column,
					sortDir:
						prev.sortBy === column && prev.sortDir === "asc" ? "desc" : "asc",
					page: 1,
				};
			},
			replace: true,
		});
	}

	function updateSearch(
		patch: (prev: DashboardSearch) => Partial<DashboardSearch>,
	) {
		navigate({
			search: (prev) => ({ ...prev, ...patch(prev), page: 1 }),
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
			<div className="shrink-0">
				<FiltersBar
					search={search}
					bounds={bounds}
					onChange={handleFilterChange}
				/>
			</div>

			<div className="shrink-0">
				<StatCards
					totalIn={data.totalIn}
					totalOut={data.totalOut}
					totalResults={data.totalResults}
				/>
			</div>

			<div className="grid shrink-0 gap-4 md:grid-cols-3">
				<div className="grid md:col-span-2">
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
					onExcludeCategory: (c) =>
						updateSearch((prev) => {
							const r = toggleExcluded(prev.category, prev.excludeCategory, c);
							return { category: r.included, excludeCategory: r.excluded };
						}),
					onExcludeType: (t) =>
						updateSearch((prev) => {
							const r = toggleExcluded(prev.type, prev.excludeType, t);
							return { type: r.included, excludeType: r.excluded };
						}),
				}}
				pagination={{
					page: search.page,
					pageSize: search.pageSize,
					totalPages,
					totalResults: data.totalResults,
					onPrevious: () =>
						navigate({
							search: (prev) => ({ ...prev, page: prev.page - 1 }),
							replace: true,
						}),
					onNext: () =>
						navigate({
							search: (prev) => ({ ...prev, page: prev.page + 1 }),
							replace: true,
						}),
					onPageSizeChange: (pageSize) =>
						navigate({
							search: (prev) => ({ ...prev, pageSize, page: 1 }),
							replace: true,
						}),
				}}
			/>
		</div>
	);
};

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
