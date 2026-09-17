import { StatCard } from "#/components/dashboard/stat-cards/stat-card";
import { getStatCardsContent } from "#/content";

export function StatCards({
	totalIn,
	totalOut,
	totalResults,
}: {
	totalIn: number;
	totalOut: number;
	totalResults: number;
}) {
	const statCardsContent = getStatCardsContent({
		totalIn,
		totalOut,
		totalResults,
	});

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			{statCardsContent.map((c) => (
				<StatCard
					key={c.title}
					title={c.title}
					description={c.description}
					content={c.content}
					color={c.color}
				/>
			))}
		</div>
	);
}
