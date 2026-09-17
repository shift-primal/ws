import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
	BANKS,
	type Bank,
	processTransactions,
	type Transaction,
} from "txcategorizer";
import { ConfirmImport } from "#/components/import/confirm-import";
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
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "#/components/shadcn/ui/field";
import { toast } from "#/components/shadcn/ui/toast";
import {
	checkDuplicateTransactions,
	importTransactions,
} from "#/server/functions/transactions";

const bankLabels: Record<Bank, string> = {
	dnb: "DNB",
	valle: "Valle",
};

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
		onError: () => {
			toast.add({ type: "error", title: "Couldn't check for duplicates" });
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

			try {
				const flags = await checkDuplicates({ data: parsed });
				setDuplicateFlags(flags);
				setPreview(parsed);
			} catch {
				// onError above already surfaced a toast
			}
		},
	});

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
			<ConfirmImport
				preview={preview}
				setPreview={setPreview}
				duplicateFlags={duplicateFlags}
				runImport={runImport}
				isPending={isPending}
			/>
		</form>
	);
};
