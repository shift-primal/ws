import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "#/components/shadcn/ui/button";
import { toast } from "#/components/shadcn/ui/toast";
import { clearTransactions } from "#/server/functions/transactions";

const Dev = () => {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: () => clearTransactions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.add({
				type: "success",
				title: "All transactions cleared",
			});
		},
	});

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-xl font-semibold">Dev tools</h1>
			<Button
				variant="destructive"
				disabled={isPending}
				onClick={() => mutate()}
			>
				Clear all transactions
			</Button>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/dev")({
	component: Dev,
});
