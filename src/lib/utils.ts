export { cn } from "cn";

export const colorClasses = {
	success: "text-success",
	destructive: "text-destructive",
};

export const colorVars = {
	success: "var(--color-success)",
	destructive: "var(--color-destructive)",
};

export function signColor(n: number): keyof typeof colorClasses {
	return n < 0 ? "destructive" : "success";
}

export const chartPalette = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
];

export const chartOtherColor = "var(--color-ring)";
