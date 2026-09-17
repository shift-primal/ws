import type { TransactionsTablePagination } from "#/components/dashboard/transactions-table";
import { Button } from "#/components/shadcn/ui/button";
import { CardFooter } from "#/components/shadcn/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/shadcn/ui/select";
import {
	getTransactionsTableFooterContent,
	PAGE_SIZE_OPTIONS,
} from "#/content";

export function TransactionsTableFooter({
	pagination,
}: {
	pagination: TransactionsTablePagination;
}) {
	const footerContent = getTransactionsTableFooterContent();

	return (
		<CardFooter className="shrink-0 flex-col gap-3 sm:grid sm:grid-cols-3">
			<div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs sm:justify-start">
				<span>{footerContent.rowsPerPage}</span>
				<Select
					value={String(pagination.pageSize)}
					onValueChange={(value) => pagination.onPageSizeChange(Number(value))}
				>
					<SelectTrigger size="sm" className="min-w-15">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZE_OPTIONS.map((size) => (
							<SelectItem key={size} value={String(size)}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex justify-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={pagination.page <= 1}
					onClick={pagination.onPrevious}
				>
					{footerContent.previous}
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={pagination.page >= pagination.totalPages}
					onClick={pagination.onNext}
				>
					{footerContent.next}
				</Button>
			</div>

			<span className="text-center text-muted-foreground text-xs sm:text-right">
				{footerContent.pageSummary(
					pagination.page,
					pagination.totalPages,
					pagination.totalResults,
				)}
			</span>
		</CardFooter>
	);
}
