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
import { MONTHLY_CHART_CONTENT } from "#/content";
import { fmtCurrency, monthLabel } from "#/lib/fmt";
import { cn, colorVars } from "#/lib/utils";

const chartConfig = {
	totalIn: {
		label: MONTHLY_CHART_CONTENT.incomeLabel,
		color: colorVars.success,
	},
	totalOut: {
		label: MONTHLY_CHART_CONTENT.expensesLabel,
		color: colorVars.destructive,
	},
} satisfies ChartConfig;

export function MonthlyChart({
	data,
}: {
	data: { month: string; totalIn: number; totalOut: number }[];
}) {
	const chartData = useMemo(() => {
		const mapped = data.map((row) => ({
			...row,
			totalOut: Math.abs(row.totalOut),
		}));

		// A single point has no line to draw, so recharts renders just a dot.
		// Padding it with a duplicate gives the area chart a flat line instead.
		return mapped.length === 1 ? [mapped[0], mapped[0]] : mapped;
	}, [data]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{MONTHLY_CHART_CONTENT.title}</CardTitle>
				<CardDescription>{MONTHLY_CHART_CONTENT.description}</CardDescription>
			</CardHeader>
			<CardContent>
				{chartData.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						{MONTHLY_CHART_CONTENT.emptyText}
					</p>
				) : (
					<ChartContainer
						config={chartConfig}
						className="aspect-auto w-full h-64 max-h-64"
					>
						<AreaChart data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								tickMargin={8}
								tickFormatter={(value: string, index: number) =>
									chartData[index]?.month === chartData[index - 1]?.month
										? ""
										: monthLabel(value, "MMM yy")
								}
							/>
							<YAxis />
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
												<span
													className={cn("font-mono font-medium tabular-nums")}
												>
													{fmtCurrency(value as number)}
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
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
