import { Footer } from "#/components/layout/footer";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="mx-auto flex min-h-full w-full max-w-7xl flex-col p-6"
			id="page-container"
		>
			{children}
			<Footer />
		</div>
	);
};
