import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { notehubApi } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag | "all";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CheckSessionResponse {
  success: boolean;
}

const withCookieHeader = (cookieHeader: string): AxiosRequestConfig => ({
  headers: {
    Cookie: cookieHeader,
  },
});

export const fetchNotes = async (
  params: FetchNotesParams,
  cookieHeader: string,
): Promise<FetchNotesResponse> => {
  const { page, perPage, search, tag } = params;

  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get(
    "/notes",
    {
      ...withCookieHeader(cookieHeader),
      params: {
        page,
        perPage,
        ...(search ? { search } : {}),
        ...(tag && tag !== "all" ? { tag } : {}),
      },
    },
  );

  return response.data;
};

export const fetchNoteById = async (
  id: string,
  cookieHeader: string,
): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.get(
    `/notes/${id}`,
    withCookieHeader(cookieHeader),
  );
  return response.data;
};

export const checkSession = async (cookieHeader: string): Promise<boolean> => {
  const response: AxiosResponse<CheckSessionResponse> = await notehubApi.get(
    "/auth/session",
    withCookieHeader(cookieHeader),
  );

  return response.data.success;
};

export const getMe = async (cookieHeader: string): Promise<User> => {
  const response: AxiosResponse<User> = await notehubApi.get(
    "/users/me",
    withCookieHeader(cookieHeader),
  );
  return response.data;
};
