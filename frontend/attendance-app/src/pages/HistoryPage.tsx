import { useRef, useState } from "react";
import * as attendanceApi from "../api/attendance";
import type { Attendance, FilterAttendance } from "../types/attendance";
import { AttendanceTable } from "../components/dashboard/AttendanceTable";

export function HistoryPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filterRef = useRef<FilterAttendance>({});

  async function fetchAttendances(
    filter: FilterAttendance,
    page: number,
    size: number,
  ) {
    const result = await attendanceApi.getAttendances({
      ...filter,
      pageNo: page,
      pageSize: size,
    });
    setAttendances(result.data);
    setTotalRecords(result.totalRecords);
  }

  async function handleFilterChange(filter: FilterAttendance) {
    filterRef.current = filter;
    setPageNo(1);
    await fetchAttendances(filter, 1, pageSize);
  }

  function handlePageChange(page: number) {
    setPageNo(page);
    void fetchAttendances(filterRef.current, page, pageSize);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPageNo(1);
    void fetchAttendances(filterRef.current, 1, size);
  }

  return (
    <div className="space-y-6">
      <AttendanceTable
        attendances={attendances}
        totalRecords={totalRecords}
        pageNo={pageNo}
        pageSize={pageSize}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
