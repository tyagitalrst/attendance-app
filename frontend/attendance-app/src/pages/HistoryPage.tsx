import { useState } from "react";
import * as attendanceApi from "../api/attendance";
import type { Attendance, FilterAttendance } from "../types/attendance";

import { AttendanceTable } from "../components/dashboard/AttendanceTable";

export function HistoryPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  async function fetchAttendances(filter: FilterAttendance) {
    const records = await attendanceApi.getAttendances(filter);
    setAttendances(records);
  }

  return (
    <div className="space-y-6">
      <AttendanceTable
        attendances={attendances}
        onFilterChange={fetchAttendances}
      />
    </div>
  );
}
