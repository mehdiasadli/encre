import { GripVertical } from "lucide-react";

interface ChapterDragOverlayProps {
	chapter: {
		title: string;
		order: number;
	};
}

export function ChapterDragOverlay({ chapter }: ChapterDragOverlayProps) {
	return (
		<div className="flex cursor-grabbing items-center gap-4 border bg-background p-4 opacity-90 shadow-lg">
			<div className="flex shrink-0 items-center gap-2">
				<GripVertical className="h-5 w-5 text-muted-foreground/60" />
				<div className="flex h-8 w-8 items-center justify-center border bg-muted font-bold font-mono text-xs">
					{chapter.order}
				</div>
			</div>
			<div className="min-w-0 flex-1">
				<h3 className="truncate font-bold uppercase tracking-tight">
					{chapter.title}
				</h3>
			</div>
		</div>
	);
}
