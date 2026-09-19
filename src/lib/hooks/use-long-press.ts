import { useRef } from "react";

const LONG_PRESS_MS = 500;
const MOVE_TOLERANCE_PX = 10;

/**
 * Touch/pen long-press handlers. Mouse is ignored — desktop uses right click.
 * After a long press fires, the trailing click is swallowed so it doesn't also
 * activate the element (e.g. open a select).
 */
export function useLongPress(onLongPress: () => void) {
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const origin = useRef({ x: 0, y: 0 });
	const fired = useRef(false);

	const cancel = () => clearTimeout(timer.current);

	return {
		onPointerDown: (e: React.PointerEvent) => {
			if (e.pointerType === "mouse") return;
			fired.current = false;
			origin.current = { x: e.clientX, y: e.clientY };
			cancel();
			timer.current = setTimeout(() => {
				fired.current = true;
				onLongPress();
			}, LONG_PRESS_MS);
		},
		onPointerMove: (e: React.PointerEvent) => {
			const dx = e.clientX - origin.current.x;
			const dy = e.clientY - origin.current.y;
			if (Math.hypot(dx, dy) > MOVE_TOLERANCE_PX) cancel();
		},
		onPointerUp: cancel,
		onPointerCancel: cancel,
		onPointerLeave: cancel,
		onClickCapture: (e: React.MouseEvent) => {
			if (!fired.current) return;
			fired.current = false;
			e.preventDefault();
			e.stopPropagation();
		},
		onContextMenu: (e: React.MouseEvent) => {
			if (fired.current || timer.current) e.preventDefault();
		},
	};
}
