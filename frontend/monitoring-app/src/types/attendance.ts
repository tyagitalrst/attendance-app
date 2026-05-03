export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "INCOMPLETE"
  | "ABSENT"
  | "LEAVE";

export interface Attendance {
  id: number;
  userId: number;
  clockInAt: string;
  clockOutAt: string | null;
  date: string;
  status: AttendanceStatus;
  remark: string | null;
  createdAt: string;
}

export interface AttendanceRequest {
  remark?: string;
}

export interface FilterAttendance {
  startDate?: string;
  endDate?: string;
  userId?: string;
}
