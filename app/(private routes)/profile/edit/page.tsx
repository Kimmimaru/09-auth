"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

interface ErrorResponse {
  response?: {
    error?: string;
  };
  error?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (user?.username) {
      return;
    }

    const bootstrapUser = async () => {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch {
        router.push("/sign-in");
      }
    };

    bootstrapUser();
  }, [router, setUser, user?.username]);

  const avatarSrc = useMemo(() => user?.avatar ?? "", [user?.avatar]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextUsername = String(formData.get("username") ?? "").trim();

    if (!nextUsername) {
      setError("Username is required.");
      return;
    }

    try {
      setError("");
      setIsPending(true);
      const updatedUser = await updateMe({ username: nextUsername });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const message =
        axiosError.response?.data?.response?.error ??
        axiosError.response?.data?.error ??
        "Unable to update profile. Please try again.";
      setError(message);
    } finally {
      setIsPending(false);
    }
  };

  if (!user || !avatarSrc) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatarSrc}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user.username}
            />
          </div>

          <p>Email: {user.email}</p>

          {error && <p>{error}</p>}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
