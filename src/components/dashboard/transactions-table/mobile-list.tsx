import { CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { CategoryCell } from "#/components/dashboard/transactions-table/category-cell";
import { DeleteRowButton } from "#/components/dashboard/transactions-table/delete-row-button";
import { Badge } from "#/components/shadcn/ui/badge";
import { getTransactionsTableContent } from "#/content";
import type { DbTransaction } from "#/db/schema";
import { fmtCurrency, fmtExchangeRate, fmtShortDate } from "#/lib/fmt";
import { TYPE_ICONS } from "#/lib/icons";
import { CURRENCY_SYMBOLS } from "#/lib/symbols";
import { cn, colorClasses, signColor } from "#/lib/utils";

export function TransactionsTableMobileList({
	data,
}: {
	data: DbTransaction[];
}) {
	const transactionsTableContent = getTransactionsTableContent();
	const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

	function toggle(id: number) {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	if (data.length === 0) {
		return (
			<p className="py-6 text-center text-muted-foreground">
				{transactionsTableContent.emptyText}
			</p>
		);
	}

	return (
		<div className="flex flex-col divide-y divide-border">
			{data.map((transaction) => {
				const expanded = expandedIds.has(transaction.id);
				const TypeIcon = TYPE_ICONS[transaction.type];
				const amount = Number(transaction.amount);

				return (
					<div key={transaction.id} className="py-3 first:pt-0 last:pb-0">
						<button
							type="button"
							aria-expanded={expanded}
							className="flex w-full items-start justify-between gap-3 text-left"
							onClick={() => toggle(transaction.id)}
						>
							<div className="flex min-w-0 items-start gap-1.5">
								<CaretRightIcon
									className={cn(
										"mt-0.5 shrink-0 text-muted-foreground transition-transform",
										expanded && "rotate-90",
									)}
								/>
								<div className="min-w-0">
									<div className="truncate font-medium">
										{transaction.merchant}
									</div>
									<div className="truncate text-muted-foreground text-xs">
										{transaction.counterparty || "-"}
									</div>
								</div>
							</div>
							<div className="shrink-0 text-right">
								<div className={colorClasses[signColor(amount)]}>
									{fmtCurrency(amount)}
								</div>
								<div className="text-muted-foreground text-xs">
									{fmtShortDate(transaction.date)}
								</div>
							</div>
						</button>

						{expanded && (
							<div className="mt-3 flex flex-wrap items-center justify-between gap-3 pl-5.5">
								<div className="flex flex-wrap items-center gap-2">
									<CategoryCell
										id={transaction.id}
										category={transaction.category}
									/>
									<Badge variant="secondary">
										<TypeIcon /> {transaction.type}
									</Badge>
									{transaction.currency && transaction.exchangeRate && (
										<Badge variant="secondary">
											{CURRENCY_SYMBOLS[transaction.currency] ?? ""}{" "}
											{transaction.currency} (
											{fmtExchangeRate(transaction.exchangeRate)})
										</Badge>
									)}
								</div>
								<DeleteRowButton id={transaction.id} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
