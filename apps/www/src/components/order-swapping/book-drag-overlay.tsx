import { GripVertical } from "lucide-react";

interface BookDragOverlayProps {
	book: {
		title: string;
		order: number;
	};
}

export function BookDragOverlay({ book }: BookDragOverlayProps) {
	return (
		<div className="flex cursor-grabbing items-center gap-4 border bg-background p-4 opacity-90 shadow-lg">
			<div className="flex shrink-0 items-center gap-2">
				<GripVertical className="h-5 w-5 text-muted-foreground/60" />
				<div className="flex h-8 w-8 items-center justify-center border bg-muted font-bold font-mono text-xs">
					{book.order}
				</div>
			</div>
			<div className="min-w-0 flex-1">
				<h3 className="truncate font-bold uppercase tracking-tight">
					{book.title}
				</h3>
			</div>
		</div>
	);
}
