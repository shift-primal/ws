import { PageContainer } from "#/components/layout/page-container";
import { LinkButton } from "#/components/ui/link-button";

export const NotFound = () => {
	return (
		<PageContainer>
			<div className="flex h-full flex-col items-center gap-4 p-8 text-center mt-32">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="max-w-md text-lg text-muted-foreground">
					This page doesn't exist.
				</p>
				<div className="flex gap-6">
					<LinkButton to="/" className="text-xl p-4">
						Go home
					</LinkButton>
				</div>
			</div>
		</PageContainer>
	);
};
