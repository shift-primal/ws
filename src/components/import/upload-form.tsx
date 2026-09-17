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
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
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
	FieldSet,
} from "#/components/shadcn/ui/field";
import { toast } from "#/components/shadcn/ui/toast";
import { getBankLabels, getUploadFormContent } from "#/content";
import {
	checkDuplicateTransactions,
	importTransactions,
} from "#/server/functions/transactions";

export const UploadForm = () => {
	const uploadFormContent = getUploadFormContent();
	const bankLabels = getBankLabels();
	const queryClient = useQueryClient();
	const [preview, setPreview] = useState<Transaction[] | null>(null);
	const [duplicateFlags, setDuplicateFlags] = useState<boolean[]>([]);

	const { mutateAsync: runImport, isPending } = useMutation({
		mutationFn: importTransactions,
		onSuccess: ({ inserted, skipped }) => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.add({
				type: "success",
				title: uploadFormContent.importCompleteTitle,
				description: uploadFormContent.importedSummary(
					inserted.length,
					skipped,
				),
			});
			setPreview(null);
			form.reset();
		},
		onError: () => {
			toast.add({
				type: "error",
				title: uploadFormContent.importFailedTitle,
			});
		},
	});

	const { mutateAsync: checkDuplicates } = useMutation({
		mutationFn: checkDuplicateTransactions,
		onError: () => {
			toast.add({
				type: "error",
				title: uploadFormContent.duplicateCheckFailedTitle,
			});
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
					title: uploadFormContent.noTransactionsTitle,
					description: uploadFormContent.noTransactionsDescription,
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
			<Card>
				<CardHeader>
					<CardTitle>{uploadFormContent.legend}</CardTitle>
					<CardDescription>{uploadFormContent.description}</CardDescription>
				</CardHeader>
				<CardContent className="p-4">
					<Field>
						<FieldSet>
							<FieldGroup>
								<form.Field
									name="file"
									validators={{
										onSubmit: ({ value }) =>
											value ? undefined : uploadFormContent.fileRequiredError,
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
														title: uploadFormContent.unsupportedFileTitle,
														description:
															uploadFormContent.unsupportedFileDescription,
													})
												}
											/>
											<FieldDescription>
												{uploadFormContent.fileAccept}
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
										onSubmit: ({ value }) =>
											value ? undefined : uploadFormContent.bankRequiredError,
									}}
								>
									{(field) => (
										<Field data-invalid={!field.state.meta.isValid}>
											<FieldLabel htmlFor="bank">
												{uploadFormContent.bankLabel}
											</FieldLabel>
											<Combobox
												items={BANKS}
												itemToStringLabel={(bank) => bankLabels[bank]}
												value={field.state.value ?? null}
												onValueChange={(value) =>
													field.handleChange(value ?? undefined)
												}
											>
												<ComboboxInput
													id="bank"
													placeholder={uploadFormContent.bankPlaceholder}
												/>
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
										<Button
											variant="outline"
											type="submit"
											disabled={isSubmitting || isPending}
										>
											{isSubmitting
												? uploadFormContent.checking
												: uploadFormContent.submit}
										</Button>
									)}
								</form.Subscribe>
							</FieldGroup>
						</FieldSet>
					</Field>
				</CardContent>
			</Card>
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
