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
import { fmtFileSize } from "#/lib/fmt";
import { cn } from "#/lib/utils";

export type DropzoneProps = {
	files: File[];
	onFilesChange: (files: File[]) => void;
	accept?: string;
	multiple?: boolean;
	className?: string;
};

export const Dropzone = ({
	files,
	onFilesChange,
	accept,
	multiple = false,
	className,
}: DropzoneProps) => {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDraggingOver, setIsDraggingOver] = useState(false);

	const addFiles = (fileList: FileList | null) => {
		if (!fileList?.length) return;
		const incoming = Array.from(fileList);
		onFilesChange(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
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
				<CardTitle>Upload files</CardTitle>
				<CardDescription>
					Drag and drop files or click to browse
				</CardDescription>
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
					<span className="text-sm font-medium">Drop files here</span>
					<span className="text-xs text-muted-foreground">
						or click to browse from your device
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
						No files uploaded yet
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
