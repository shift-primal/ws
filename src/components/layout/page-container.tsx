export const PageContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="mx-auto flex h-full min-h-0 w-full max-w-full flex-col p-6"
			id="page-container"
		>
			{children}
		</div>
	);
};
