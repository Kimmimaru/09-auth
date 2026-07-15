import type { Metadata } from "next";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api/serverApi";
import { makeQueryClient } from "@/lib/queryClient";

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const cookieHeader = (await cookies()).toString();

  try {
    const note = await fetchNoteById(id, cookieHeader);
    const shortDescription = note.content.trim().slice(0, 140);
    const description = shortDescription || "View note details in NoteHub.";
    const title = `${note.title} | NoteHub`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://notehub.com/notes/${id}`,
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
  } catch {
    const title = "Note | NoteHub";
    const description = "View note details in NoteHub.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://notehub.com/notes/${id}`,
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
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const cookieHeader = (await cookies()).toString();
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id, cookieHeader),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
