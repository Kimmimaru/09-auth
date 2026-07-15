"use client";

import type { ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote, type CreateNoteParams } from "@/lib/api";
import { type NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

interface NoteFormData {
  title: string;
  content: string;
  tag: NoteTag;
}

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
  });

  const updateDraftFromForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const form = event.currentTarget.form;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const nextDraft: NoteFormData = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      tag: (formData.get("tag") as NoteTag) ?? "Todo",
    };

    setDraft(nextDraft);
  };

  const handleSubmit = async (formData: FormData): Promise<void> => {
    const payload: CreateNoteParams = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      tag: ((formData.get("tag") as NoteTag) ?? "Todo") as NoteTag,
    };

    if (payload.title.length < 3 || payload.title.length > 50) {
      return;
    }

    if (payload.content.length > 500) {
      return;
    }

    await createNoteMutation.mutateAsync(payload);
    clearDraft();
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
    router.push("/notes/filter/all");
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={updateDraftFromForm}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={updateDraftFromForm}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={updateDraftFromForm}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          formAction={handleSubmit}
          disabled={createNoteMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
