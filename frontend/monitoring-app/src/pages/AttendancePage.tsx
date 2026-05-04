import { useRef, useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { AttendanceTable } from "../components/attendance/AttendanceTable";
import * as adminApi from "../api/admin";
import type { Attendance, FilterAttendance } from "../types/attendance";

export function AttendancePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [records, setRecords] = useState<(Attendance & { user?: any })[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filterRef = useRef<FilterAttendance>({});

  async function fetchAttendance(
    filter: FilterAttendance,
    page: number,
    size: number,
  ) {
    setLoading(true);
    try {
      const result = await adminApi.getAttendances({
        ...filter,
        pageNo: page,
        pageSize: size,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRecords(result.data as any);
      setTotalRecords(result.totalRecords);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(filter: FilterAttendance) {
    filterRef.current = filter;
    setPageNo(1);
    void fetchAttendance(filter, 1, pageSize);
  }

  function handlePageChange(page: number) {
    setPageNo(page);
    void fetchAttendance(filterRef.current, page, pageSize);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPageNo(1);
    void fetchAttendance(filterRef.current, 1, size);
  }

  return (
    <AdminLayout>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Attendance Records</h2>
        </div>
        <AttendanceTable
          records={records}
          loading={loading}
          totalRecords={totalRecords}
          pageNo={pageNo}
          pageSize={pageSize}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </AdminLayout>
  );
}
