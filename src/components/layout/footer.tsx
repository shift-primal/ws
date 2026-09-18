import { buttonVariants } from "#/components/shadcn/ui/button";
import { getContactLinks, getFooterCopyright } from "#/content";
import { cn } from "#/lib/utils";

export const Footer = () => {
	return (
		<footer className="mt-auto flex w-full max-w-full shrink-0 items-center justify-between gap-2 border-t-2 px-4 py-3 text-muted-foreground text-xs">
			<span>{getFooterCopyright(new Date().getFullYear())}</span>

			<div className="flex gap-1">
				{getContactLinks().map(({ label, icon: LinkIcon, href }) => (
					<a
						key={label}
						href={href}
						target="_blank"
						rel="noreferrer"
						aria-label={label}
						className={cn(
							buttonVariants({ variant: "ghost", size: "icon-sm" }),
						)}
					>
						<LinkIcon />
					</a>
				))}
			</div>
		</footer>
	);
};
