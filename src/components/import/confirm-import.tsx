import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import type { Transaction } from "txcategorizer";
import { Button } from "#/components/shadcn/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/shadcn/ui/dialog";
import { fmtCurrency } from "#/lib/fmt";
import { PreviewTable } from "./preview-table";

type ConfirmImportProps = {
	preview: Transaction[] | null;
	setPreview: (preview: Transaction[] | null) => void;
	duplicateFlags: boolean[];
	runImport: (opts: { data: Transaction[] }) => void;
	isPending: boolean;
};

export const ConfirmImport = ({
	preview,
	setPreview,
	duplicateFlags,
	runImport,
	isPending,
}: ConfirmImportProps) => {
	const summary = useMemo(() => {
		if (!preview) return null;

		const totalIn = preview.reduce(
			(sum, tx) => (tx.amount > 0 ? sum + tx.amount : sum),
			0,
		);
		const totalOut = preview.reduce(
			(sum, tx) => (tx.amount < 0 ? sum + tx.amount : sum),
			0,
		);
		const dates = preview.map((tx) => tx.date).sort();
		const duplicates = duplicateFlags.filter(Boolean).length;

		return {
			count: preview.length,
			totalIn,
			totalOut,
			duplicates,
			from: dates[0],
			to: dates.at(-1),
		};
	}, [preview, duplicateFlags]);

	return (
		<Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Confirm import</DialogTitle>
					<DialogDescription>
						{summary && (
							<>
								{summary.count} transaction{summary.count === 1 ? "" : "s"}
								{summary.from && summary.to && (
									<>
										from {format(parseISO(summary.from), "LLL dd, y")} to{" "}
										{format(parseISO(summary.to), "LLL dd, y")}
									</>
								)}
								: {fmtCurrency(summary.totalIn)} in,{" "}
								{fmtCurrency(summary.totalOut)} out.
								{summary.duplicates > 0 && (
									<>
										{" "}
										{summary.duplicates} already imported and will be skipped.
									</>
								)}
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				{preview && (
					<PreviewTable preview={preview} duplicateFlags={duplicateFlags} />
				)}

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => setPreview(null)}
					>
						Cancel
					</Button>
					<Button
						type="button"
						disabled={isPending}
						onClick={() => preview && runImport({ data: preview })}
					>
						Confirm import
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
