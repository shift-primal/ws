import { createFileRoute } from "@tanstack/react-router";
import { UploadForm } from "#/components/import/upload-form";

const Import = () => {
	return (
		<div className="mx-auto max-w-7xl w-full">
			<UploadForm />
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/import")({
	component: Import,
});
