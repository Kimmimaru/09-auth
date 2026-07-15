import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import NotePreviewClient from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api/serverApi";
import { makeQueryClient } from "@/lib/queryClient";

interface NotePreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePreviewPage({
  params,
}: NotePreviewPageProps) {
  const cookieHeader = (await cookies()).toString();
  const { id } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id, cookieHeader),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
