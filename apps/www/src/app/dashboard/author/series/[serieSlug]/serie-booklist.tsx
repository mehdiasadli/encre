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
	AuthorGetBooksListOutputType,
	GetSerieOutputType,
} from "@encre/schemas";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BookIcon, PlusIcon, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookDragOverlay } from "@/components/order-swapping/book-drag-overlay";
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
import { useORPCMutation } from "@/hooks/use-orpc-mutation";
import { orpc } from "@/utils/orpc";
import { BookCard, BookCardLoading } from "./book-card";

interface SerieBooklistProps {
	serie: GetSerieOutputType;
}

export function SerieBooklist({ serie }: SerieBooklistProps) {
	const {
		data: books,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		...orpc.books.authorGetBooksList.queryOptions({
			input: {
				series: [serie.slug],
			},
		}),
	});

	const [localBooks, setLocalBooks] = useState<AuthorGetBooksListOutputType>(
		[],
	);
	const [activeBook, setActiveBook] = useState<
		AuthorGetBooksListOutputType[number] | null
	>(null);
	const [pendingSwap, setPendingSwap] = useState<PendingSwap | null>(null);

	useEffect(() => {
		if (books) {
			setLocalBooks(books);
		}
	}, [books]);

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
	const { mutate: swapBooks, isPending: isSwapping } = useORPCMutation({
		...orpc.books.swapBookOrder.mutationOptions(),
		onSuccess() {
			toast.success("Books reordered successfully");
			setPendingSwap(null);
			refetch();
		},
		onError() {
			// Reset to original order on error
			if (books) {
				setLocalBooks(books);
			}
			setPendingSwap(null);
		},
	});

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const book = localBooks.find((b) => b.slug === active.id);
		setActiveBook(book || null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		setActiveBook(null);

		if (!over || active.id === over.id) {
			return;
		}

		const book1 = localBooks.find((b) => b.slug === active.id);
		const book2 = localBooks.find((b) => b.slug === over.id);

		if (!book1 || !book2) {
			return;
		}

		// Optimistically update local state
		setLocalBooks((prev) => {
			const newBooks = [...prev];
			const index1 = newBooks.findIndex((b) => b.slug === book1.slug);
			const index2 = newBooks.findIndex((b) => b.slug === book2.slug);

			// Swap orders
			const temp = newBooks[index1].order;
			newBooks[index1] = { ...newBooks[index1], order: newBooks[index2].order };
			newBooks[index2] = { ...newBooks[index2], order: temp };

			// Sort by order
			return newBooks.sort((a, b) => a.order - b.order);
		});

		// Set pending swap for confirmation
		setPendingSwap({
			item1: { slug: book1.slug, title: book1.title, order: book1.order },
			item2: { slug: book2.slug, title: book2.title, order: book2.order },
		});
	};

	const handleConfirmSwap = () => {
		if (!pendingSwap) return;

		swapBooks({
			book1: pendingSwap.item1.slug,
			book2: pendingSwap.item2.slug,
		});
	};

	const handleCancelSwap = () => {
		// Reset to original order
		if (books) {
			setLocalBooks(books);
		}
		setPendingSwap(null);
	};

	if (isLoading) {
		return <SerieBooklistLoading />;
	}

	if (error) {
		return (
			<div>
				<Alert variant="error">
					<AlertTriangle />
					<AlertTitle>Error Occured While Fetching the Serie</AlertTitle>
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

	if (!books || books.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<BookIcon />
					</EmptyMedia>
					<EmptyTitle>No books found</EmptyTitle>
					<EmptyDescription>
						Add a new book to start your serie.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button
						render={
							<Link
								href={`/dashboard/author/series/${serie.slug}/books/create`}
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
					<FrameTitle>List of books</FrameTitle>
					<FrameDescription>Manage your books in this serie.</FrameDescription>
				</FrameHeader>
				<FramePanel>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={localBooks.map((b) => b.slug)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-2">
								{localBooks.map((book) => (
									<BookCard
										key={book.slug}
										book={book}
										serieSlug={serie.slug}
									/>
								))}
							</div>
						</SortableContext>

						<DragOverlay>
							{activeBook && <BookDragOverlay book={activeBook} />}
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

export function SerieBooklistLoading() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>List of books</FrameTitle>
				<FrameDescription>Manage your books in this serie.</FrameDescription>
			</FrameHeader>
			<FramePanel>
				<div className="space-y-2">
					{Array.from({ length: 12 }).map((_, index) => (
						<BookCardLoading
							key={`${
								// biome-ignore lint/suspicious/noArrayIndexKey: array index key
								index
							}-loading`}
						/>
					))}
				</div>
			</FramePanel>
		</Frame>
	);
}
