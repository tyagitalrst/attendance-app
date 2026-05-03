import { apiClient } from "./client";
import type {
  Attendance,
  AttendanceRequest,
  FilterAttendance,
} from "../types/attendance";

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
  filters?: FilterAttendance,
): Promise<Attendance[]> {
  const { data } = await apiClient.get<Attendance[]>("attendances", {
    params: filters,
  });
  return data;
}
