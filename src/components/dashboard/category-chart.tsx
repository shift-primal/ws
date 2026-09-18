import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
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
import { getCategoryChartContent } from "#/content";
import { fmtCurrency } from "#/lib/fmt";
import { chartOtherColor, chartPalette } from "#/lib/utils";

const MAX_SLICES = chartPalette.length;

export function CategoryChart({
	data,
}: {
	data: {
		category: string;
		direction: "income" | "expense";
		total: string | null;
	}[];
}) {
	const categoryChartContent = getCategoryChartContent();

	const { chartData, chartConfig } = useMemo(() => {
		const ranked = data
			.filter((row) => row.direction === "expense")
			.map((row) => ({
				category: row.category,
				amount: Math.abs(Number.parseFloat(row.total ?? "0")),
			}))
			.sort((a, b) => b.amount - a.amount);

		const top = ranked.slice(0, MAX_SLICES);
		const otherAmount = ranked
			.slice(MAX_SLICES)
			.reduce((sum, row) => sum + row.amount, 0);

		// "Annet" ("Other"/misc) is both a real transaction category and the
		// label we give the synthetic overflow bucket below — if the real
		// category made it into `top`, fold the overflow into it instead of
		// pushing a second slice with the same category, which would collide
		// as a React key and as a chartConfig entry.
		let slices = top;
		if (otherAmount > 0) {
			const existingOtherIndex = top.findIndex(
				(row) => row.category === categoryChartContent.otherLabel,
			);
			slices =
				existingOtherIndex >= 0
					? top.map((row, index) =>
							index === existingOtherIndex
								? { ...row, amount: row.amount + otherAmount }
								: row,
						)
					: [
							...top,
							{
								category: categoryChartContent.otherLabel,
								amount: otherAmount,
							},
						];
			slices = [...slices].sort((a, b) => b.amount - a.amount);
		}

		const config: ChartConfig = {};
		const chartData = slices.map((slice, index) => {
			const color =
				slice.category === categoryChartContent.otherLabel
					? chartOtherColor
					: chartPalette[index % chartPalette.length];
			config[slice.category] = { label: slice.category, color };
			return { ...slice, fill: color };
		});

		return { chartData, chartConfig: config };
	}, [data, categoryChartContent.otherLabel]);

	const total = chartData.reduce((sum, row) => sum + row.amount, 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{categoryChartContent.title}</CardTitle>
				<CardDescription>{categoryChartContent.description}</CardDescription>
			</CardHeader>
			<CardContent>
				{chartData.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						{categoryChartContent.emptyText}
					</p>
				) : (
					<>
						<ChartContainer
							config={chartConfig}
							className="mx-auto aspect-square max-h-48"
						>
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={
										<ChartTooltipContent
											hideLabel
											formatter={(value, name) => (
												<div className="flex w-full justify-between gap-4">
													<span className="text-muted-foreground">{name}</span>
													<span className="font-mono font-medium text-foreground tabular-nums">
														{fmtCurrency(value as number)}
													</span>
												</div>
											)}
										/>
									}
								/>
								<Pie
									data={chartData}
									dataKey="amount"
									nameKey="category"
									innerRadius={72}
									outerRadius={96}
									paddingAngle={-0.5}
								>
									<Label
										content={({ viewBox }) => {
											if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
												return null;

											return (
												<text
													textAnchor="middle"
													dominantBaseline="middle"
													pointerEvents="none"
												>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className="fill-foreground text-base font-bold"
													>
														{fmtCurrency(total)}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy ?? 0) + 22}
														className="fill-muted-foreground text-xs"
													>
														{categoryChartContent.totalLabel}
													</tspan>
												</text>
											);
										}}
									/>
								</Pie>
							</PieChart>
						</ChartContainer>

						<div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs">
							{chartData.map((slice) => (
								<div key={slice.category} className="flex items-center gap-1.5">
									<span
										className="size-2 shrink-0"
										style={{ backgroundColor: slice.fill }}
									/>
									<span className="text-muted-foreground">
										{slice.category}
									</span>
								</div>
							))}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
