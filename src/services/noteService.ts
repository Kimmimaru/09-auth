import axios, { type AxiosResponse } from "axios";
import { type Note, type NoteTag } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const noteHubApi = axios.create({
  baseURL: API_BASE_URL,
});

noteHubApi.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
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

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { page, perPage, search } = params;

  const response: AxiosResponse<FetchNotesResponse> = await noteHubApi.get(
    "/notes",
    {
      params: {
        page,
        perPage,
        ...(search ? { search } : {}),
      },
    },
  );

  return response.data;
};

export const createNote = async (params: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await noteHubApi.post("/notes", params);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await noteHubApi.delete(`/notes/${id}`);
  return response.data;
};
