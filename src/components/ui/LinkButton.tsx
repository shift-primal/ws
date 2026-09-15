import { createLink } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { buttonVariants } from "#/components/shadcn/button";
import { cn } from "#/lib/utils";

type BasicLinkProps = React.ComponentPropsWithoutRef<"a"> &
	VariantProps<typeof buttonVariants>;

const BasicLink = forwardRef<HTMLAnchorElement, BasicLinkProps>(
	({ className, variant, size, ...props }, ref) => (
		<a
			ref={ref}
			className={cn(
				buttonVariants({
					variant,
					size,
					className,
				}),
			)}
			{...props}
		/>
	),
);

export const LinkButton = createLink(BasicLink);
