"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";
import { type NoteTag } from "@/types/note";
import css from "@/react-notehub-styles-hw-07/styles/NotesPage.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  tag: NoteTag | "all";
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSetSearchValue = useDebouncedCallback((value: string) => {
    setSearchValue(value.trim());
    setCurrentPage(1);
  }, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchValue, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: searchValue,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSetSearchValue} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Something went wrong.</p>}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}
    </main>
  );
}
