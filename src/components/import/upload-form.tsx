import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import {
	BANKS,
	type Bank,
	processTransactions,
	type Transaction,
} from "txcategorizer";
import { Dropzone } from "#/components/import/dropzone";
import { Badge } from "#/components/shadcn/ui/badge";
import { Button } from "#/components/shadcn/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "#/components/shadcn/ui/combobox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/shadcn/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "#/components/shadcn/ui/field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/shadcn/ui/table";
import { toast } from "#/components/shadcn/ui/toast";
import { fmtCurrency } from "#/lib/fmt";
import {
	checkDuplicateTransactions,
	importTransactions,
} from "#/server/functions/transactions";

const bankLabels: Record<Bank, string> = {
	dnb: "DNB",
	valle: "Valle",
};

const PREVIEW_ROW_LIMIT = 50;

export const UploadForm = () => {
	const queryClient = useQueryClient();
	const [preview, setPreview] = useState<Transaction[] | null>(null);
	const [duplicateFlags, setDuplicateFlags] = useState<boolean[]>([]);

	const { mutateAsync: runImport, isPending } = useMutation({
		mutationFn: importTransactions,
		onSuccess: ({ inserted, skipped }) => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.add({
				type: "success",
				title: "Import complete",
				description:
					skipped > 0
						? `Imported ${inserted.length}, skipped ${skipped} duplicate${skipped === 1 ? "" : "s"}.`
						: `Imported ${inserted.length} transaction${inserted.length === 1 ? "" : "s"}.`,
			});
			setPreview(null);
			form.reset();
		},
		onError: () => {
			toast.add({ type: "error", title: "Import failed" });
		},
	});

	const { mutateAsync: checkDuplicates } = useMutation({
		mutationFn: checkDuplicateTransactions,
	});

	const form = useForm({
		defaultValues: {
			file: undefined as File | undefined,
			bank: undefined as Bank | undefined,
		},
		onSubmit: async ({ value }) => {
			if (!value.file || !value.bank) return;
			const buffer = await value.file.arrayBuffer();
			const parsed = processTransactions(buffer, value.bank);

			if (parsed.length === 0) {
				toast.add({
					type: "error",
					title: "No transactions found",
					description:
						"Couldn't find any transactions in this file. Check that it's a valid export from the selected bank.",
				});
				return;
			}

			const flags = await checkDuplicates({ data: parsed });
			setDuplicateFlags(flags);
			setPreview(parsed);
		},
	});

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
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Field>
				<FieldSet>
					<FieldLegend>Import transactions</FieldLegend>
					<FieldDescription>
						Import your transactions from a file
					</FieldDescription>
					<FieldGroup>
						<form.Field
							name="file"
							validators={{
								onSubmit: ({ value }) =>
									value ? undefined : "Select a file to import",
							}}
						>
							{(field) => (
								<Field data-invalid={!field.state.meta.isValid}>
									<Dropzone
										files={field.state.value ? [field.state.value] : []}
										onFilesChange={(files) => field.handleChange(files[0])}
										accept=".csv,.txt,text/csv,text/plain"
										onFilesRejected={() =>
											toast.add({
												type: "error",
												title: "Unsupported file",
												description: "Only .csv and .txt files are accepted.",
											})
										}
									/>
									<FieldDescription>
										Accepts .csv and .txt files
									</FieldDescription>
									<FieldError
										errors={field.state.meta.errors.map((message) => ({
											message: message as string,
										}))}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field
							name="bank"
							validators={{
								onSubmit: ({ value }) => (value ? undefined : "Select a bank"),
							}}
						>
							{(field) => (
								<Field data-invalid={!field.state.meta.isValid}>
									<FieldLabel htmlFor="bank">Bank</FieldLabel>
									<Combobox
										items={BANKS}
										itemToStringLabel={(bank) => bankLabels[bank]}
										value={field.state.value ?? null}
										onValueChange={(value) =>
											field.handleChange(value ?? undefined)
										}
									>
										<ComboboxInput id="bank" placeholder="Select your bank" />
										<ComboboxContent>
											<ComboboxList>
												{(item: Bank) => (
													<ComboboxItem key={item} value={item}>
														{bankLabels[item]}
													</ComboboxItem>
												)}
											</ComboboxList>
										</ComboboxContent>
									</Combobox>
									<FieldError
										errors={field.state.meta.errors.map((message) => ({
											message: message as string,
										}))}
									/>
								</Field>
							)}
						</form.Field>

						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<Button type="submit" disabled={isSubmitting || isPending}>
									{isSubmitting ? "Checking…" : "Preview import"}
								</Button>
							)}
						</form.Subscribe>
					</FieldGroup>
				</FieldSet>
			</Field>

			<Dialog
				open={!!preview}
				onOpenChange={(open) => !open && setPreview(null)}
			>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Confirm import</DialogTitle>
						<DialogDescription>
							{summary && (
								<>
									{summary.count} transaction{summary.count === 1 ? "" : "s"}
									{summary.from && summary.to && (
										<>
											{" "}
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

					<div className="max-h-[50vh] overflow-y-auto">
						<Table>
							<TableHeader className="sticky top-0 z-10 bg-popover">
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Merchant</TableHead>
									<TableHead>Category</TableHead>
									<TableHead className="text-right">Amount</TableHead>
									<TableHead />
								</TableRow>
							</TableHeader>
							<TableBody>
								{preview?.slice(0, PREVIEW_ROW_LIMIT).map((tx, i) => {
									const isDuplicate = duplicateFlags[i] ?? false;
									return (
										<TableRow
											// biome-ignore lint/suspicious/noArrayIndexKey: rows can be genuine duplicates (identical date/merchant/amount/category), so the index disambiguates a static, non-reorderable list
											key={`${i}-${tx.date}-${tx.merchant}-${tx.amount}-${tx.category}`}
											className={
												isDuplicate ? "text-muted-foreground" : undefined
											}
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
													<Badge variant="outline">Duplicate</Badge>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
					{preview && preview.length > PREVIEW_ROW_LIMIT && (
						<FieldDescription>
							and {preview.length - PREVIEW_ROW_LIMIT} more…
						</FieldDescription>
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
		</form>
	);
};
