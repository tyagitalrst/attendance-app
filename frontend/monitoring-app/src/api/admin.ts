import { monitorClient } from "./client";
import type {
  FilterUser,
  User,
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
} from "../types/user";
import type { Attendance, FilterAttendance } from "../types/attendance";
import type { PaginatedResponse } from "../types/general";

export async function getUsers(
  params: FilterUser = {},
): Promise<PaginatedResponse<User>> {
  const { data } = await monitorClient.get<PaginatedResponse<User>>(
    "admin/users",
    { params },
  );
  return data;
}

export async function getUser(id: number) {
  const { data } = await monitorClient.get(`admin/users/${id}`);
  return data;
}

export async function createUser(payload: AdminCreateUserRequest) {
  const { data } = await monitorClient.post<User>("admin/users", payload);
  return data;
}

export async function updateUser(id: number, payload: AdminUpdateUserRequest) {
  const { data } = await monitorClient.patch<User>(
    `admin/users/${id}`,
    payload,
  );
  return data;
}

export async function deleteUser(id: number) {
  const { data } = await monitorClient.delete<{ id: number }>(
    `admin/users/${id}`,
  );
  return data;
}

export async function getAttendances(
  params: FilterAttendance = {},
): Promise<PaginatedResponse<Attendance>> {
  const { data } = await monitorClient.get<PaginatedResponse<Attendance>>(
    "admin/attendances",
    { params },
  );
  return data;
}
