import { createFileRoute } from "@tanstack/react-router";

const Dashboard = () => {
	return <div>Hello "/_authenticated/dashboard"!</div>;
};

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: Dashboard,
});
