import type { AttendanceStatus } from "../types/attendance";

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  PRESENT:    "bg-green-100 text-green-800",
  LATE:       "bg-orange-300 text-yellow-800",
  INCOMPLETE: "bg-yellow-100 text-yellow-700",
  ABSENT:     "bg-red-100 text-red-800",
  LEAVE:      "bg-blue-100 text-blue-800",
};

export function statusColor(status: AttendanceStatus): string {
  return STATUS_COLOR[status] ?? "bg-gray-100 text-gray-700";
}
