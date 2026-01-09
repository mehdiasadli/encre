"use client";

import {
	type AuthorSearchResourceOutputType,
	SearchableResourceSchema,
} from "@encre/schemas";
import { formatEnum } from "@encre/utils";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { parseAsBoolean, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect } from "react";
import {
	Command,
	CommandDialog,
	CommandDialogPopup,
	CommandDialogTrigger,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { orpc } from "@/utils/orpc";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Tabs, TabsList, TabsTab } from "./ui/tabs";

export function AuthorGlobalSearchDialog() {
	const [open, setOpen] = useQueryState(
		"global-search",
		parseAsBoolean.withDefault(false),
	);
	const [selectedType, setSelectedType] = useQueryState(
		"global-search-type",
		parseAsStringLiteral(SearchableResourceSchema.options).withDefault("serie"),
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
				type: selectedType,
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
					<Tabs
						className="mx-auto px-4 py-2"
						value={selectedType}
						onValueChange={(value) =>
							setSelectedType(value as AuthorSearchResourceOutputType["type"])
						}
					>
						<TabsList variant="underline">
							{SearchableResourceSchema.options.map((option) => (
								<TabsTab key={option} value={option}>
									{formatEnum(option, { capitalization: "upper" })}
								</TabsTab>
							))}
						</TabsList>
					</Tabs>
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
							<SearchItem key={item.slug} item={item} type={selectedType} />
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
	type,
}: {
	item: AuthorSearchResourceOutputType["items"][number];
	type: AuthorSearchResourceOutputType["type"];
}) {
	return (
		<CommandItem key={item.slug} render={<Link href={item.url as Route} />}>
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex flex-col gap-y-1">
					<h3 className="font-medium text-sm leading-none">{item.title}</h3>
					<p className="line-clamp-2 truncate text-muted-foreground text-xs">
						{item.description || "No description"}
					</p>
				</div>
				<Badge variant="outline">
					{formatEnum(type, { capitalization: "upper" })}
				</Badge>
			</div>
		</CommandItem>
	);
}
