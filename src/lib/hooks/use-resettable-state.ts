import { useState } from "react";

export function useResettableState<T>(value: T, key: unknown) {
	const [state, setState] = useState(value);
	const [prevKey, setPrevKey] = useState(key);

	if (key !== prevKey) {
		setPrevKey(key);
		setState(value);
	}

	return [state, setState] as const;
}
