import { apiClient } from "./client";
import type { AuthResponse, AuthRequest } from "../types/auth";
import type { UpdateUserRequest } from "../types/user";

export async function login(payload: AuthRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("auth/login", payload);
  return data;
}

export async function getProfile() {
  const { data } = await apiClient.get("profile");
  return data;
}

export async function updateProfile(payload: UpdateUserRequest) {
  const { data } = await apiClient.patch("profile", payload);
  return data;
}

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ url: string }>("upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}
