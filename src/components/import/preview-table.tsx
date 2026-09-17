import { format, parseISO } from "date-fns";
import type { Transaction } from "txcategorizer";
import { Badge } from "#/components/shadcn/ui/badge";
import { FieldDescription } from "#/components/shadcn/ui/field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/shadcn/ui/table";
import { getPreviewTableContent, getTransactionsColumnLabels } from "#/content";
import { fmtCurrency } from "#/lib/fmt";

const PREVIEW_ROW_LIMIT = 50;

type PreviewTableProps = {
	preview: Transaction[];
	duplicateFlags: boolean[];
};

export const PreviewTable = ({
	preview,
	duplicateFlags,
}: PreviewTableProps) => {
	const previewTableContent = getPreviewTableContent();
	const columnLabels = getTransactionsColumnLabels();

	return (
		<>
			<div className="max-h-[50vh] overflow-y-auto">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-popover">
						<TableRow>
							<TableHead>{columnLabels.date}</TableHead>
							<TableHead>{columnLabels.merchant}</TableHead>
							<TableHead>{columnLabels.category}</TableHead>
							<TableHead className="text-right">
								{columnLabels.amount}
							</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{preview.slice(0, PREVIEW_ROW_LIMIT).map((tx, i) => {
							const isDuplicate = duplicateFlags[i] ?? false;
							return (
								<TableRow
									// biome-ignore lint/suspicious/noArrayIndexKey: rows can be genuine duplicates (identical date/merchant/amount/category), so the index disambiguates a static, non-reorderable list
									key={`${i}-${tx.date}-${tx.merchant}-${tx.amount}-${tx.category}`}
									className={isDuplicate ? "text-muted-foreground" : undefined}
								>
									<TableCell>
										{format(parseISO(tx.date), "LLL dd, y")}
									</TableCell>
									<TableCell>{tx.merchant}</TableCell>
									<TableCell>{tx.category}</TableCell>
									<TableCell className="text-right">
										{fmtCurrency(tx.amount)}
									</TableCell>
									<TableCell>
										{isDuplicate && (
											<Badge variant="outline">
												{previewTableContent.duplicateBadge}
											</Badge>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
			{preview.length > PREVIEW_ROW_LIMIT && (
				<FieldDescription>
					{previewTableContent.moreRows(preview.length - PREVIEW_ROW_LIMIT)}
				</FieldDescription>
			)}
		</>
	);
};
