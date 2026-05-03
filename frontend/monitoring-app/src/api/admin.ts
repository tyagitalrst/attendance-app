import { monitorClient } from "./client";
import type {
  FilterUser,
  User,
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
} from "../types/user";
import type { Attendance, FilterAttendance } from "../types/attendance";

export async function getUsers(filters?: FilterUser): Promise<User[]> {
  const { data } = await monitorClient.get<User[]>("admin/users", {
    params: filters,
  });
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
  filters?: FilterAttendance,
): Promise<Attendance[]> {
  const { data } = await monitorClient.get<Attendance[]>("admin/attendances", {
    params: filters,
  });
  return data;
}
