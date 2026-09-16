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
import { removeTransactions } from "#/server/functions/transactions";

export const DeleteRowButton = ({ id }: { id: number }) => {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: () => removeTransactions({ data: [id] }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
					<PopoverTitle>Are you sure you wish to delete this row?</PopoverTitle>
					<PopoverDescription>
						<span>This action can not be undone!</span>
					</PopoverDescription>
				</PopoverHeader>
				<Button
					variant="destructive"
					disabled={isPending}
					onClick={() => mutate()}
				>
					Delete
				</Button>
			</PopoverContent>
		</Popover>
	);
};
