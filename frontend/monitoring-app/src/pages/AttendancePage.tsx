import { useEffect, useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { AttendanceTable } from "../components/attendance/AttendanceTable";
import * as adminApi from "../api/admin";
import type { Attendance, FilterAttendance } from "../types/attendance";

export function AttendancePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [records, setRecords] = useState<(Attendance & { user?: any })[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAttendance(filter: FilterAttendance = {}) {
    setLoading(true);
    try {
      const data = await adminApi.getAttendances({
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRecords(data as any);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchAttendance();
  }, []);

  return (
    <AdminLayout>
      <div className="rounded-lg bg-white p-6 shadow">
        {" "}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Attendance Records</h2>
        </div>
        <AttendanceTable
          records={records}
          loading={loading}
          onFilterChange={fetchAttendance}
        />
      </div>
    </AdminLayout>
  );
}
