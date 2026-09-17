import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import type { Transaction } from "txcategorizer";
import { Badge } from "#/components/shadcn/ui/badge";
import { Button } from "#/components/shadcn/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/shadcn/ui/dialog";
import { CONFIRM_IMPORT_CONTENT } from "#/content";
import { fmtCurrency } from "#/lib/fmt";
import { cn, colorClasses } from "#/lib/utils";
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

	const dateRange =
		summary?.from && summary.to
			? `${format(parseISO(summary.from), "LLL dd, y")} – ${format(parseISO(summary.to), "LLL dd, y")}`
			: null;

	return (
		<Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{CONFIRM_IMPORT_CONTENT.title}</DialogTitle>
					{summary && (
						<DialogDescription>
							{CONFIRM_IMPORT_CONTENT.transactionCount(summary.count)}
							{dateRange && ` · ${dateRange}`}
						</DialogDescription>
					)}
				</DialogHeader>

				{summary && (
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
						<span className={cn("font-medium", colorClasses.success)}>
							{fmtCurrency(summary.totalIn)} in
						</span>
						<span className={cn("font-medium", colorClasses.destructive)}>
							{fmtCurrency(summary.totalOut)} out
						</span>
						{summary.duplicates > 0 && (
							<Badge variant="outline">
								{CONFIRM_IMPORT_CONTENT.duplicatesSkipped(summary.duplicates)}
							</Badge>
						)}
					</div>
				)}

				{preview && (
					<PreviewTable preview={preview} duplicateFlags={duplicateFlags} />
				)}

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => setPreview(null)}
					>
						{CONFIRM_IMPORT_CONTENT.cancelButton}
					</Button>
					<Button
						type="button"
						disabled={isPending}
						onClick={() => preview && runImport({ data: preview })}
					>
						{CONFIRM_IMPORT_CONTENT.confirmButton}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
