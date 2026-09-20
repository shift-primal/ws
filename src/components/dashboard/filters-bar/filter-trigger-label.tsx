export function FilterTriggerLabel({
	included,
	excluded,
	anyLabel,
}: {
	included: string[] | undefined;
	excluded: string[] | undefined;
	anyLabel: string;
}) {
	const inc = included ?? [];
	const exc = excluded ?? [];

	if (!inc.length && !exc.length) {
		return <span className="truncate">{anyLabel}</span>;
	}

	const includedText = inc.length === 0 ? anyLabel : summarize(inc);
	return (
		<span className="flex min-w-0 gap-1.5 truncate">
			<span className="truncate text-green-600 dark:text-green-400">
				{includedText}
			</span>
			{exc.length > 0 && (
				<span className="truncate text-red-600 dark:text-red-400">
					{summarize(exc)}
				</span>
			)}
		</span>
	);
}

function summarize(items: string[]) {
	return items.length === 1 ? items[0] : String(items.length);
}
