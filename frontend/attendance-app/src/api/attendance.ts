import { apiClient } from "./client";
import type {
  Attendance,
  AttendanceRequest,
  FilterAttendance,
} from "../types/attendance";
import type { PaginatedResponse } from "../types/general";

export async function clockIn(
  payload?: AttendanceRequest,
): Promise<Attendance> {
  const { data } = await apiClient.post<Attendance>(
    "attendances/clock-in",
    payload,
  );
  return data;
}

export async function clockOut(
  payload?: AttendanceRequest,
): Promise<Attendance> {
  const { data } = await apiClient.patch<Attendance>(
    "attendances/clock-out",
    payload,
  );
  return data;
}

export async function getAttendances(
  params: FilterAttendance = {},
): Promise<PaginatedResponse<Attendance>> {
  const { data } = await apiClient.get<PaginatedResponse<Attendance>>(
    "attendances",
    { params },
  );
  return data;
}
