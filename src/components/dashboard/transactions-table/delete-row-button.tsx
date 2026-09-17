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
import { DELETE_ROW_BUTTON_CONTENT } from "#/content";
import { removeTransactions } from "#/server/functions/transactions";

export const DeleteRowButton = ({ id }: { id: number }) => {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: () => removeTransactions({ data: [id] }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.add({
				type: "success",
				title: DELETE_ROW_BUTTON_CONTENT.successToastTitle,
			});
			setOpen(false);
		},
	});

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger render={<Button variant="ghost" size="icon-xs" />}>
				<TrashIcon />
			</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>{DELETE_ROW_BUTTON_CONTENT.confirmTitle}</PopoverTitle>
					<PopoverDescription>
						<span>{DELETE_ROW_BUTTON_CONTENT.confirmDescription}</span>
					</PopoverDescription>
				</PopoverHeader>
				<Button
					variant="destructive"
					disabled={isPending}
					onClick={() => mutate()}
				>
					{DELETE_ROW_BUTTON_CONTENT.confirmButton}
				</Button>
			</PopoverContent>
		</Popover>
	);
};
