import { CloudArrowUpIcon, FileIcon, TrashIcon } from "@phosphor-icons/react";
import { type DragEvent, useId, useRef, useState } from "react";
import { Button } from "#/components/shadcn/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "#/components/shadcn/ui/item";
import { DROPZONE_CONTENT } from "#/content";
import { fmtFileSize } from "#/lib/fmt";
import { cn } from "#/lib/utils";

export type DropzoneProps = {
	files: File[];
	onFilesChange: (files: File[]) => void;
	accept?: string;
	onFilesRejected?: (files: File[]) => void;
	multiple?: boolean;
	className?: string;
};

function matchesAccept(file: File, accept?: string) {
	if (!accept) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();

	return accept
		.split(",")
		.map((pattern) => pattern.trim().toLowerCase())
		.filter(Boolean)
		.some((pattern) => {
			if (pattern.startsWith(".")) return name.endsWith(pattern);
			if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1));
			return type === pattern;
		});
}

export const Dropzone = ({
	files,
	onFilesChange,
	accept,
	onFilesRejected,
	multiple = false,
	className,
}: DropzoneProps) => {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDraggingOver, setIsDraggingOver] = useState(false);

	const addFiles = (fileList: FileList | null) => {
		if (!fileList?.length) return;
		const incoming = Array.from(fileList);
		const accepted = incoming.filter((file) => matchesAccept(file, accept));
		const rejected = incoming.filter((file) => !matchesAccept(file, accept));

		if (rejected.length > 0) onFilesRejected?.(rejected);
		if (accepted.length === 0) return;

		onFilesChange(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
	};

	const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDraggingOver(false);
		addFiles(e.dataTransfer.files);
	};

	const removeFile = (index: number) => {
		onFilesChange(files.filter((_, i) => i !== index));
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{DROPZONE_CONTENT.title}</CardTitle>
				<CardDescription>{DROPZONE_CONTENT.description}</CardDescription>
			</CardHeader>

			<CardContent>
				<button
					type="button"
					id={inputId}
					onClick={() => inputRef.current?.click()}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDraggingOver(true);
					}}
					onDragLeave={() => setIsDraggingOver(false)}
					onDrop={handleDrop}
					className={cn(
						"flex w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border py-10 text-center transition-colors hover:bg-muted/30",
						isDraggingOver && "border-ring bg-muted/50",
					)}
				>
					<CloudArrowUpIcon className="size-8 text-muted-foreground" />
					<span className="text-sm font-medium">
						{DROPZONE_CONTENT.dropText}
					</span>
					<span className="text-xs text-muted-foreground">
						{DROPZONE_CONTENT.browseText}
					</span>
				</button>

				<input
					ref={inputRef}
					type="file"
					accept={accept}
					multiple={multiple}
					className="hidden"
					onChange={(e) => {
						addFiles(e.target.files);
						e.target.value = "";
					}}
				/>
			</CardContent>

			<CardFooter className="flex-col items-stretch gap-2">
				{files.length === 0 ? (
					<p className="py-1 text-center text-xs text-muted-foreground">
						{DROPZONE_CONTENT.emptyText}
					</p>
				) : (
					<ItemGroup>
						{files.map((file, index) => (
							<Item
								key={`${file.name}-${file.size}-${file.lastModified}`}
								variant="outline"
								size="sm"
							>
								<ItemMedia variant="icon">
									<FileIcon className="text-muted-foreground" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>{file.name}</ItemTitle>
									<ItemDescription>{fmtFileSize(file.size)}</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Button
										type="button"
										variant="ghost"
										size="icon-xs"
										onClick={() => removeFile(index)}
									>
										<TrashIcon />
									</Button>
								</ItemActions>
							</Item>
						))}
					</ItemGroup>
				)}
			</CardFooter>
		</Card>
	);
};
