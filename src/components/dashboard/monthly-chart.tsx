import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/shadcn/ui/chart";
import { formatCurrency } from "#/lib/currency";

const incomeConfig = {
	totalIn: {
		label: "Income",
		color: "var(--color-emerald-600)",
	},
} satisfies ChartConfig;

const expenseConfig = {
	totalOut: {
		label: "Expenses",
		color: "var(--color-destructive)",
	},
} satisfies ChartConfig;

// Income and expenses differ by an order of magnitude, so each gets its own
// auto-scaled panel on a shared timeline instead of a single shared y-axis
// (which flattens the smaller series to a hairline) or a dual-axis chart
// (which invents a correlation between two unrelated scales).
const SYNC_ID = "monthly-trend";

function monthLabel(month: string, pattern: string) {
	return format(parseISO(`${month}-01`), pattern);
}

export function MonthlyChart({
	data,
}: {
	data: { month: string; totalIn: number; totalOut: number }[];
}) {
	const chartData = useMemo(
		() => data.map((row) => ({ ...row, totalOut: Math.abs(row.totalOut) })),
		[data],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Monthly trend</CardTitle>
				<CardDescription>Income vs. expenses over time</CardDescription>
			</CardHeader>
			<CardContent>
				{chartData.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						No data for the current filters.
					</p>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<p className="font-medium text-emerald-600 text-xs">Income</p>
							<ChartContainer
								config={incomeConfig}
								className="aspect-auto h-28 w-full"
							>
								<AreaChart
									data={chartData}
									syncId={SYNC_ID}
									margin={{ left: 12, right: 12 }}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="month"
										tickLine={false}
										axisLine={false}
										tick={false}
									/>
									<YAxis hide domain={[0, "dataMax"]} />
									<ChartTooltip
										cursor={false}
										content={
											<ChartTooltipContent
												indicator="line"
												labelFormatter={(value) =>
													monthLabel(value, "MMMM yyyy")
												}
												formatter={(value) => (
													<span className="font-mono font-medium text-foreground tabular-nums">
														{formatCurrency(value as number)}
													</span>
												)}
											/>
										}
									/>
									<Area
										dataKey="totalIn"
										type="monotone"
										fill="var(--color-totalIn)"
										fillOpacity={0.25}
										stroke="var(--color-totalIn)"
										isAnimationActive={false}
									/>
								</AreaChart>
							</ChartContainer>
						</div>

						<div className="flex flex-col gap-1.5">
							<p className="font-medium text-destructive text-xs">Expenses</p>
							<ChartContainer
								config={expenseConfig}
								className="aspect-auto h-28 w-full"
							>
								<AreaChart
									data={chartData}
									syncId={SYNC_ID}
									margin={{ left: 12, right: 12 }}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="month"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value: string) =>
											monthLabel(value, "MMM yy")
										}
									/>
									<YAxis hide domain={[0, "dataMax"]} />
									<ChartTooltip
										cursor={false}
										content={
											<ChartTooltipContent
												indicator="line"
												labelFormatter={(value) =>
													monthLabel(value, "MMMM yyyy")
												}
												formatter={(value) => (
													<span className="font-mono font-medium text-foreground tabular-nums">
														{formatCurrency(value as number)}
													</span>
												)}
											/>
										}
									/>
									<Area
										dataKey="totalOut"
										type="monotone"
										fill="var(--color-totalOut)"
										fillOpacity={0.25}
										stroke="var(--color-totalOut)"
										isAnimationActive={false}
									/>
								</AreaChart>
							</ChartContainer>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
