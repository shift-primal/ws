import { TrashIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "#/components/shadcn/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "#/components/shadcn/ui/popover";
import { toast } from "#/components/shadcn/ui/toast";
import { getDeleteRowButtonContent } from "#/content";
import { removeTransactions } from "#/server/functions/transactions";

export const DeleteRowButton = ({ id }: { id: number }) => {
	const deleteRowButtonContent = getDeleteRowButtonContent();
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: () => removeTransactions({ data: [id] }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.add({
				type: "success",
				title: deleteRowButtonContent.successToastTitle,
			});
			setOpen(false);
		},
		onError: (error) => {
			toast.add({ type: "error", title: error.message });
		},
	});

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger render={<Button variant="ghost" size="icon-xs" />}>
				<TrashIcon />
			</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>{deleteRowButtonContent.confirmTitle}</PopoverTitle>
					<PopoverDescription>
						<span>{deleteRowButtonContent.confirmDescription}</span>
					</PopoverDescription>
				</PopoverHeader>
				<Button
					variant="destructive"
					disabled={isPending}
					onClick={() => mutate()}
				>
					{deleteRowButtonContent.confirmButton}
				</Button>
			</PopoverContent>
		</Popover>
	);
};
