import { createFileRoute } from "@tanstack/react-router";

const Import = () => {
	return <div>Hello "/_authenticated/import"!</div>;
};

export const Route = createFileRoute("/_authenticated/import")({
	component: Import,
});
