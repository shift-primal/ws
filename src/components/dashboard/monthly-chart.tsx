import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/shadcn/ui/chart";
import { formatCurrency } from "#/lib/currency";

const chartConfig = {
	totalIn: {
		label: "Income",
		color: "var(--color-emerald-600)",
	},
	totalOut: {
		label: "Expenses",
		color: "var(--color-destructive)",
	},
} satisfies ChartConfig;

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
					<ChartContainer
						config={chartConfig}
						className="aspect-auto h-72 w-full"
					>
						<AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value: string) => monthLabel(value, "MMM yy")}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										indicator="line"
										labelFormatter={(value) => monthLabel(value, "MMMM yyyy")}
										formatter={(value, name) => (
											<div className="flex w-full justify-between gap-4">
												<span className="text-muted-foreground">
													{chartConfig[name as keyof typeof chartConfig]
														?.label ?? name}
												</span>
												<span className="font-mono font-medium text-foreground tabular-nums">
													{formatCurrency(value as number)}
												</span>
											</div>
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
							<Area
								dataKey="totalOut"
								type="monotone"
								fill="var(--color-totalOut)"
								fillOpacity={0.25}
								stroke="var(--color-totalOut)"
								isAnimationActive={false}
							/>
							<ChartLegend content={<ChartLegendContent />} />
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
