export const PageContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="mx-auto min-h-full p-6" id="page-container">
			{children}
		</div>
	);
};
