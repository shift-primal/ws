/**
 * Toggles `value` in the exclude list. Excluding also drops it from the
 * include list so the two never contradict each other. Empty lists become
 * `undefined` so they stay out of the URL.
 */
export function toggleExcluded<T extends string>(
	included: T[] | undefined,
	excluded: T[] | undefined,
	value: T,
): { included: T[] | undefined; excluded: T[] | undefined } {
	const isExcluded = excluded?.includes(value) ?? false;
	const nextExcluded = isExcluded
		? (excluded ?? []).filter((v) => v !== value)
		: [...(excluded ?? []), value];
	const nextIncluded = (included ?? []).filter((v) => v !== value);
	return {
		included: nextIncluded.length ? nextIncluded : undefined,
		excluded: nextExcluded.length ? nextExcluded : undefined,
	};
}
