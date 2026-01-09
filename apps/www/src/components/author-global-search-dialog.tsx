"use client";

import type { AuthorSearchResourceOutputType } from "@encre/schemas";
import { formatEnum } from "@encre/utils";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";
import {
	Command,
	CommandDialog,
	CommandDialogPopup,
	CommandDialogTrigger,
	CommandEmpty,
	CommandGroup,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { orpc } from "@/utils/orpc";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Kbd } from "./ui/kbd";

export function AuthorGlobalSearchDialog() {
	const [open, setOpen] = useQueryState(
		"global-search",
		parseAsBoolean.withDefault(false),
	);
	const [search, setSearch] = useQueryState("global-search-query");
	const [debouncedSearch] = useDebouncedValue(search, {
		wait: 500,
		enabled: Boolean(search),
	});

	const { data, isLoading, error } = useQuery({
		...orpc.resources.authorSearchResource.queryOptions({
			enabled: open,
			input: {
				query: debouncedSearch || "",
				type: "serie",
			},
		}),
	});

	const onOpenChange = (open: boolean) => {
		if (!open) {
			setSearch(null);
		}

		setOpen(open);
	};

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandDialogTrigger
				render={<SearchButton onClick={() => setOpen(true)} />}
			/>
			<CommandDialogPopup className="max-w-3xl">
				<Command items={data?.items ?? []}>
					<CommandInput
						value={search || ""}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search for series, books, chapters, characters, places, articles..."
					/>
					{search && (
						<CommandEmpty>
							{isLoading
								? "Searching ..."
								: data?.items.length === 0
									? "No results found."
									: error
										? "An error occured"
										: null}
						</CommandEmpty>
					)}

					<CommandList>
						{(item: AuthorSearchResourceOutputType["items"][number]) => (
							<SearchItem key={item.slug} item={item} type={data?.type} />
						)}
					</CommandList>
				</Command>
			</CommandDialogPopup>
		</CommandDialog>
	);
}

function SearchButton({ onClick }: { onClick: () => void }) {
	return (
		<Button type="button" onClick={onClick} variant="outline">
			<SearchIcon className="size-4" />
			<span className="font-medium text-sm">Search</span>
			<Kbd>⌘K</Kbd>
		</Button>
	);
}

function SearchItem({
	item,
	type = "serie",
}: {
	item: AuthorSearchResourceOutputType["items"][number];
	type?: AuthorSearchResourceOutputType["type"];
}) {
	const { description, title, slug } = item;

	const buildUrl = () => {
		switch (type) {
			case "serie":
				return `/dashboard/author/series/${slug}` as string;
			default:
				throw new Error("Invalid type");
		}
	};

	return (
		<CommandItem key={item.slug} render={<Link href={buildUrl() as Route} />}>
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex flex-col gap-y-1">
					<h3 className="font-medium text-sm leading-none">{item.title}</h3>
					<p className="line-clamp-2 truncate text-muted-foreground text-xs">
						{description ?? "No description"}
					</p>
				</div>
				<Badge variant="outline">
					{formatEnum(type, { capitalization: "upper" })}
				</Badge>
			</div>
		</CommandItem>
	);
}
