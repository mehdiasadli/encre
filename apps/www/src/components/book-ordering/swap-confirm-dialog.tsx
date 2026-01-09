import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPopup,
	DialogTitle,
} from "../ui/dialog";

export interface PendingSwap {
	book1: { slug: string; title: string; order: number };
	book2: { slug: string; title: string; order: number };
}

interface SwapConfirmDialogProps {
	pendingSwap: PendingSwap | null;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading: boolean;
}

export function SwapConfirmDialog({
	pendingSwap,
	onConfirm,
	onCancel,
	isLoading,
}: SwapConfirmDialogProps) {
	return (
		<Dialog open={!!pendingSwap} onOpenChange={(open) => !open && onCancel()}>
			<DialogPopup>
				<DialogHeader>
					<DialogTitle>Confirm Reorder</DialogTitle>
					<DialogDescription>
						Are you sure you want to swap the order of these books?
					</DialogDescription>
				</DialogHeader>

				{pendingSwap && (
					<div className="px-4 pb-4">
						<div className="flex items-center gap-3 border bg-muted/50 p-4">
							<div className="flex-1 text-center">
								<div className="mb-1 text-muted-foreground text-xs">
									Position {pendingSwap.book1.order}
								</div>
								<div className="truncate font-semibold">
									{pendingSwap.book1.title}
								</div>
							</div>

							<div className="shrink-0">
								<ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
							</div>

							<div className="flex-1 text-center">
								<div className="mb-1 text-muted-foreground text-xs">
									Position {pendingSwap.book2.order}
								</div>
								<div className="truncate font-semibold">
									{pendingSwap.book2.title}
								</div>
							</div>
						</div>
					</div>
				)}

				<DialogFooter>
					<DialogClose
						render={<Button variant="outline" disabled={isLoading} />}
					>
						Cancel
					</DialogClose>
					<LoadingButton
						isLoading={isLoading}
						loadingText="Swapping..."
						onClick={onConfirm}
					>
						Confirm Swap
					</LoadingButton>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}
