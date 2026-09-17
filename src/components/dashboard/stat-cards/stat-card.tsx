import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import type { StatCardProps } from "#/content";
import { cn, colorClasses } from "#/lib/utils";

export const StatCard = ({
	title,
	description,
	content,
	color,
}: StatCardProps) => (
	<Card className="justify-between">
		<CardHeader>
			<CardTitle className="text-sm md:text-lg font-bold">{title}</CardTitle>
			{description && (
				<CardDescription className="text-muted-foreground text-xs font-normal">
					{description}
				</CardDescription>
			)}
		</CardHeader>
		<CardContent
			className={cn(
				"text-lg lg:text-xl font-semibold",
				color && colorClasses[color],
			)}
		>
			{content}
		</CardContent>
	</Card>
);
