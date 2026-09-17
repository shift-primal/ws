import { PageContainer } from "#/components/layout/page-container";
import { LinkButton } from "#/components/ui/link-button";
import { getNotFoundContent } from "#/content";

export const NotFound = () => {
	const notFoundContent = getNotFoundContent();

	return (
		<PageContainer>
			<div className="flex h-full flex-col items-center gap-4 p-8 text-center mt-32">
				<h1 className="text-4xl font-bold">{notFoundContent.heading}</h1>
				<p className="max-w-md text-lg text-muted-foreground">
					{notFoundContent.message}
				</p>
				<div className="flex gap-6">
					<LinkButton to="/" className="text-xl p-4">
						{notFoundContent.homeLink}
					</LinkButton>
				</div>
			</div>
		</PageContainer>
	);
};
