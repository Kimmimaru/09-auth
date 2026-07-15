import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { makeQueryClient } from "@/lib/queryClient";

const PER_PAGE = 12;

interface FilterNotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: FilterNotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const routeTag = slug[0] ?? "all";
  const normalizedTag = routeTag === "all" ? "All" : routeTag;

  const title = `${normalizedTag} notes | NoteHub`;
  const description = `Browse ${normalizedTag.toLowerCase()} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${routeTag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub application preview",
        },
      ],
    },
  };
}

const isTag = (value: string): value is NoteTag => {
  return ["Todo", "Work", "Personal", "Meeting", "Shopping"].includes(value);
};

export default async function FilterNotesPage({
  params,
}: FilterNotesPageProps) {
  const { slug } = await params;
  const routeTag = slug[0] ?? "all";
  const tag: NoteTag | "all" =
    routeTag === "all" ? "all" : isTag(routeTag) ? routeTag : "all";

  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
