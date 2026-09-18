import { useAuth, useSession } from "@better-auth-ui/react";
import { RocketLaunchIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "#/components/layout/page-container";
import { LinkButton } from "#/components/ui/link-button";
import { getHomeContent } from "#/content";
import { isDemoAccountEmail } from "#/lib/demo-accounts";

const Home = () => {
	const content = getHomeContent();
	const { authClient } = useAuth();
	const { data: session } = useSession(authClient);
	// A real, already signed-in user has no reason to be routed to the
	// sign-in page — same rule the navbar's demo account switcher uses.
	const showDemoButton = !session || isDemoAccountEmail(session.user.email);

	return (
		<PageContainer>
			<div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center mt-24">
				<h1 className="text-5xl font-bold tracking-tight">wastescope</h1>
				<p className="max-w-md text-lg text-muted-foreground">
					{content.description}
				</p>
				<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
					<LinkButton to="/dashboard" size="lg" className="px-6 text-base">
						{content.dashboardButton}
					</LinkButton>
					{showDemoButton && (
						<LinkButton
							to="/auth/$path"
							params={{ path: "sign-in" }}
							variant="outline"
							size="lg"
							className="px-6 text-base"
						>
							<RocketLaunchIcon data-icon="inline-start" />
							{content.demoButton}
						</LinkButton>
					)}
				</div>
				{showDemoButton && (
					<p className="text-xs text-muted-foreground">{content.demoHint}</p>
				)}
			</div>
		</PageContainer>
	);
};

export const Route = createFileRoute("/")({
	component: Home,
});
