"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
	AuthorGetBookOutputType,
	AuthorGetChaptersListOutputType,
} from "@encre/schemas";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BookIcon, PlusIcon, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChapterDragOverlay } from "@/components/order-swapping/chapter-drag-overlay";
import {
	type PendingSwap,
	SwapConfirmDialog,
} from "@/components/order-swapping/swap-confirm-dialog";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Frame,
	FrameDescription,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from "@/components/ui/frame";
import { LoadingButton } from "@/components/ui/loading-button";
import { Spinner } from "@/components/ui/spinner";
import { useORPCMutation } from "@/hooks/use-orpc-mutation";
import { orpc } from "@/utils/orpc";
import { ChapterCard } from "./chapter-card";

interface BookChapterlistProps {
	book: AuthorGetBookOutputType;
}

export function BookChapterlist({ book }: BookChapterlistProps) {
	const { serieSlug } = useParams() as { serieSlug: string };

	const {
		data: chapters,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		...orpc.chapters.authorGetChaptersList.queryOptions({
			input: {
				books: [book.slug],
			},
		}),
	});

	const [localChapters, setLocalChapters] =
		useState<AuthorGetChaptersListOutputType>([]);
	const [activeChapter, setActiveChapter] = useState<
		AuthorGetChaptersListOutputType[number] | null
	>(null);
	const [pendingSwap, setPendingSwap] = useState<PendingSwap | null>(null);

	useEffect(() => {
		if (chapters) {
			setLocalChapters(chapters);
		}
	}, [chapters]);

	// DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // Prevent accidental drags
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Swap mutation
	const { mutate: swapChapters, isPending: isSwapping } = useORPCMutation({
		...orpc.chapters.swapChapterOrder.mutationOptions(),
		onSuccess() {
			toast.success("Chapters reordered successfully");
			setPendingSwap(null);
			refetch();
		},
		onError() {
			// Reset to original order on error
			if (chapters) {
				setLocalChapters(chapters);
			}
			setPendingSwap(null);
		},
	});

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const chapter = localChapters.find((c) => c.slug === active.id);
		setActiveChapter(chapter || null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		setActiveChapter(null);

		if (!over || active.id === over.id) {
			return;
		}

		const chapter1 = localChapters.find((c) => c.slug === active.id);
		const chapter2 = localChapters.find((c) => c.slug === over.id);

		if (!chapter1 || !chapter2) {
			return;
		}

		// Optimistically update local state
		setLocalChapters((prev) => {
			const newChapters = [...prev];
			const index1 = newChapters.findIndex((c) => c.slug === chapter1.slug);
			const index2 = newChapters.findIndex((c) => c.slug === chapter2.slug);

			// Swap orders
			const temp = newChapters[index1].order;
			newChapters[index1] = {
				...newChapters[index1],
				order: newChapters[index2].order,
			};
			newChapters[index2] = { ...newChapters[index2], order: temp };

			// Sort by order
			return newChapters.sort((a, b) => a.order - b.order);
		});

		// Set pending swap for confirmation
		setPendingSwap({
			item1: {
				slug: chapter1.slug,
				title: chapter1.title,
				order: chapter1.order,
			},
			item2: {
				slug: chapter2.slug,
				title: chapter2.title,
				order: chapter2.order,
			},
		});
	};

	const handleConfirmSwap = () => {
		if (!pendingSwap) return;

		swapChapters({
			chapter1: pendingSwap.item1.slug,
			chapter2: pendingSwap.item2.slug,
		});
	};

	const handleCancelSwap = () => {
		// Reset to original order
		if (chapters) {
			setLocalChapters(chapters);
		}
		setPendingSwap(null);
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return (
			<div>
				<Alert variant="error">
					<AlertTriangle />
					<AlertTitle>Error Occured While Fetching the Chapter</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
					<AlertAction>
						<LoadingButton
							loadingText="Retrying"
							variant="destructive"
							onClick={() => refetch()}
							isLoading={isRefetching}
						>
							<RefreshCcw />
							Retry
						</LoadingButton>
					</AlertAction>
				</Alert>
			</div>
		);
	}

	if (!chapters || chapters.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<BookIcon />
					</EmptyMedia>
					<EmptyTitle>No chapters found</EmptyTitle>
					<EmptyDescription>
						Add a new chapter to start your book.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button
						render={
							<Link
								href={`/dashboard/author/series/${serieSlug}/books/${book.slug}/chapters/create`}
							/>
						}
					>
						<PlusIcon />
						Add a new book
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<>
			<Frame>
				<FrameHeader>
					<FrameTitle>List of chapters</FrameTitle>
					<FrameDescription>
						Manage your chapters in this book.
					</FrameDescription>
				</FrameHeader>
				<FramePanel>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={localChapters.map((b) => b.slug)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-2">
								{localChapters.map((chapter) => (
									<ChapterCard key={chapter.slug} chapter={chapter} />
								))}
							</div>
						</SortableContext>

						<DragOverlay>
							{activeChapter && <ChapterDragOverlay chapter={activeChapter} />}
						</DragOverlay>
					</DndContext>
				</FramePanel>
			</Frame>

			<SwapConfirmDialog
				pendingSwap={pendingSwap}
				onConfirm={handleConfirmSwap}
				onCancel={handleCancelSwap}
				isLoading={isSwapping}
			/>
		</>
	);
}
