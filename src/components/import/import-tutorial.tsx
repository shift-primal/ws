import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowSquareOutIcon,
	QuestionIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import step1 from "#/assets/steps/step-001.jpg";
import step2 from "#/assets/steps/step-002.jpg";
import step3 from "#/assets/steps/step-003.jpg";
import step4 from "#/assets/steps/step-004.jpg";
import step5 from "#/assets/steps/step-005.jpg";
import step6 from "#/assets/steps/step-006.jpg";
import step7 from "#/assets/steps/step-007.jpg";
import step8 from "#/assets/steps/step-008.jpg";
import step9 from "#/assets/steps/step-009.jpg";
import step10 from "#/assets/steps/step-010.jpg";
import step11 from "#/assets/steps/step-011.jpg";
import { Button } from "#/components/shadcn/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/shadcn/ui/dialog";
import { getImportTutorialContent } from "#/content";
import { cn } from "#/lib/utils";

const STEP_IMAGES = [
	step1,
	step2,
	step3,
	step4,
	step5,
	step6,
	step7,
	step8,
	step9,
	step10,
	step11,
];

export const ImportTutorial = () => {
	const content = getImportTutorialContent();
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);
	const total = content.steps.length;
	const step = content.steps[index];
	const isFirst = index === 0;
	const isLast = index === total - 1;

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) setIndex(0);
			}}
		>
			<DialogTrigger render={<Button type="button" variant="outline" />}>
				<QuestionIcon />
				{content.trigger}
			</DialogTrigger>
			<DialogContent className="max-h-[95dvh] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{content.title}</DialogTitle>
					<DialogDescription>{content.description}</DialogDescription>
				</DialogHeader>

				<div className="flex max-h-[50dvh] justify-center overflow-hidden rounded-md border bg-muted">
					<img
						src={STEP_IMAGES[index]}
						alt={step.title}
						className="h-full max-h-[50dvh] w-auto object-contain"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<p className="text-muted-foreground text-xs">
						{content.stepCounter(index + 1, total)}
					</p>
					<h3 className="font-medium text-sm">{step.title}</h3>
					<p className="text-muted-foreground text-xs/relaxed">
						{step.description}
					</p>
					{step.link && (
						<Button
							className="mt-2 self-start"
							variant="outline"
							size="sm"
							render={
								<a href={step.link.href} target="_blank" rel="noreferrer" />
							}
							nativeButton={false}
						>
							{step.link.label}
							<ArrowSquareOutIcon />
						</Button>
					)}
				</div>

				<div className="flex justify-center gap-1.5">
					{content.steps.map((s, i) => (
						<button
							key={s.title}
							type="button"
							aria-label={content.stepCounter(i + 1, total)}
							aria-current={i === index}
							onClick={() => setIndex(i)}
							className={cn(
								"size-2 rounded-full bg-muted-foreground/30 transition-colors",
								i === index && "bg-primary",
							)}
						/>
					))}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						disabled={isFirst}
						onClick={() => setIndex(index - 1)}
					>
						<ArrowLeftIcon />
						{content.previous}
					</Button>
					{isLast ? (
						<Button type="button" onClick={() => setOpen(false)}>
							{content.done}
						</Button>
					) : (
						<Button type="button" onClick={() => setIndex(index + 1)}>
							{content.next}
							<ArrowRightIcon />
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
