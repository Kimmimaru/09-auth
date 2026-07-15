import type { AxiosResponse } from "axios";
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

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

interface AuthPayload {
  email: string;
  password: string;
}

interface CheckSessionResponse {
  success: boolean;
}

interface UpdateMePayload {
  username: string;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { page, perPage, search, tag } = params;

  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get(
    "/notes",
    {
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

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (params: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.post("/notes", params);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.delete(`/notes/${id}`);
  return response.data;
};

export const register = async (payload: AuthPayload): Promise<User> => {
  const response: AxiosResponse<User> = await notehubApi.post(
    "/auth/register",
    payload,
  );
  return response.data;
};

export const login = async (payload: AuthPayload): Promise<User> => {
  const response: AxiosResponse<User> = await notehubApi.post(
    "/auth/login",
    payload,
  );
  return response.data;
};

export const logout = async (): Promise<void> => {
  await notehubApi.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const response: AxiosResponse<CheckSessionResponse> =
    await notehubApi.get("/auth/session");
  return response.data.success;
};

export const getMe = async (): Promise<User> => {
  const response: AxiosResponse<User> = await notehubApi.get("/users/me");
  return response.data;
};

export const updateMe = async (payload: UpdateMePayload): Promise<User> => {
  const response: AxiosResponse<User> = await notehubApi.patch(
    "/users/me",
    payload,
  );
  return response.data;
};
