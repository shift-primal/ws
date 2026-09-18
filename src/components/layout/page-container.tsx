export const PageContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="mx-auto flex w-full max-w-7xl flex-col p-6"
			id="page-container"
		>
			{children}
		</div>
	);
};
