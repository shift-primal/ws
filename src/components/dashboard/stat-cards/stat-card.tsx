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
	contentCompact,
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
				"wrap-break-word text-lg lg:text-xl font-semibold",
				color && colorClasses[color],
			)}
		>
			{contentCompact ? (
				<>
					<span className="min-[516px]:hidden">{contentCompact}</span>
					<span className="hidden min-[516px]:inline">{content}</span>
				</>
			) : (
				content
			)}
		</CardContent>
	</Card>
);
