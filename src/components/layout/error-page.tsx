import type { ErrorComponentProps } from "@tanstack/react-router";
import { PageContainer } from "#/components/layout/page-container";
import { Button } from "#/components/shadcn/ui/button";
import { LinkButton } from "#/components/ui/link-button";
import { getErrorContent, getUnauthorizedErrorContent } from "#/content";

const isUnauthorizedError = (error: unknown) =>
	error instanceof Error && error.message === "Unauthorized";

export const ErrorPage = ({ error, reset }: ErrorComponentProps) => {
	if (isUnauthorizedError(error)) {
		const unauthorizedContent = getUnauthorizedErrorContent();

		return (
			<PageContainer>
				<div className="flex h-full flex-col items-center gap-4 p-8 text-center mt-32">
					<h1 className="text-4xl font-bold">{unauthorizedContent.heading}</h1>
					<p className="max-w-md text-lg text-muted-foreground">
						{unauthorizedContent.message}
					</p>
					<div className="flex gap-6">
						<LinkButton
							to="/auth/$path"
							params={{ path: "sign-in" }}
							className="text-xl p-4"
						>
							{unauthorizedContent.signInLink}
						</LinkButton>
					</div>
				</div>
			</PageContainer>
		);
	}

	const errorContent = getErrorContent();

	return (
		<PageContainer>
			<div className="flex h-full flex-col items-center gap-4 p-8 text-center mt-32">
				<h1 className="text-4xl font-bold">{errorContent.heading}</h1>
				<p className="max-w-md text-lg text-muted-foreground">
					{errorContent.message}
				</p>
				<div className="flex gap-6">
					<Button size="lg" className="text-xl p-4" onClick={reset}>
						{errorContent.retryButton}
					</Button>
					<LinkButton to="/" variant="outline" className="text-xl p-4">
						{errorContent.homeLink}
					</LinkButton>
				</div>
			</div>
		</PageContainer>
	);
};
