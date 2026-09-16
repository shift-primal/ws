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
import { importTransactions } from "#/server/functions/transactions";

const bankLabels: Record<Bank, string> = {
	dnb: "DNB",
	valle: "Valle",
};

const PREVIEW_ROW_LIMIT = 50;

export const UploadForm = () => {
	const queryClient = useQueryClient();
	const [preview, setPreview] = useState<Transaction[] | null>(null);

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

	const form = useForm({
		defaultValues: {
			file: undefined as File | undefined,
			bank: undefined as Bank | undefined,
		},
		onSubmit: async ({ value }) => {
			if (!value.file || !value.bank) return;
			const buffer = await value.file.arrayBuffer();
			setPreview(processTransactions(buffer, value.bank));
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

		return {
			count: preview.length,
			totalIn,
			totalOut,
			from: dates[0],
			to: dates.at(-1),
		};
	}, [preview]);

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
										accept=".csv,.txt"
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

						<Button type="submit" disabled={isPending}>
							Preview import
						</Button>
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
								</>
							)}
						</DialogDescription>
					</DialogHeader>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Merchant</TableHead>
								<TableHead>Category</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{preview?.slice(0, PREVIEW_ROW_LIMIT).map((tx) => (
								<TableRow
									key={`${tx.date}-${tx.merchant}-${tx.amount}-${tx.category}`}
								>
									<TableCell>
										{format(parseISO(tx.date), "LLL dd, y")}
									</TableCell>
									<TableCell>{tx.merchant}</TableCell>
									<TableCell>{tx.category}</TableCell>
									<TableCell className="text-right">
										{fmtCurrency(tx.amount)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
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
