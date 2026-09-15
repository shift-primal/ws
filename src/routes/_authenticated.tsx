import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "#/components/layout/PageContainer";

export const Route = createFileRoute("/_authenticated")({
	component: () => (
		<PageContainer>
			<div>
				<p>Authenticated</p>
			</div>
		</PageContainer>
	),
});
