import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import { formatCurrency } from "#/lib/currency";

export function StatCards({
	totalIn,
	totalOut,
	totalResults,
}: {
	totalIn: number;
	totalOut: number;
	totalResults: number;
}) {
	const net = totalIn + totalOut;

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-muted-foreground text-sm font-normal">
						Income
					</CardTitle>
				</CardHeader>
				<CardContent className="text-2xl font-semibold text-emerald-600">
					{formatCurrency(totalIn)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-muted-foreground text-sm font-normal">
						Expenses
					</CardTitle>
				</CardHeader>
				<CardContent className="text-2xl font-semibold text-destructive">
					{formatCurrency(totalOut)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-muted-foreground text-sm font-normal">
						Net
					</CardTitle>
				</CardHeader>
				<CardContent
					className={
						net < 0
							? "text-2xl font-semibold text-destructive"
							: "text-2xl font-semibold text-emerald-600"
					}
				>
					{formatCurrency(net)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-muted-foreground text-sm font-normal">
						Transactions
					</CardTitle>
				</CardHeader>
				<CardContent className="text-2xl font-semibold">
					{totalResults}
				</CardContent>
			</Card>
		</div>
	);
}
