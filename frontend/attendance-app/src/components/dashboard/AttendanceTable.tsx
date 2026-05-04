import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import type { Attendance, FilterAttendance } from "../../types/attendance";
import { formatDate, formatTime } from "../../utils/date";
import { statusColor } from "../../utils/statusColor";
import { Paginator } from "../common/Paginator";

interface Props {
  attendances: Attendance[];
  totalRecords: number;
  pageNo: number;
  pageSize: number;
  onFilterChange: (filter: FilterAttendance) => Promise<void>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function currentMonthRange() {
  const now = new Date();
  return {
    start: format(startOfMonth(now), "yyyy-MM-dd"),
    end: format(endOfMonth(now), "yyyy-MM-dd"),
  };
}

export function AttendanceTable({
  attendances,
  totalRecords,
  pageNo,
  pageSize,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const { start, end } = currentMonthRange();
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    void onFilterChange({ startDate: start, endDate: end });
  }, []);

  function handleApply() {
    if (!startDate || !endDate) {
      setValidationError("Both From and To dates are required.");
      return;
    }
    setValidationError(null);
    void onFilterChange({ startDate, endDate });
  }

  function handleReset() {
    setStartDate(start);
    setEndDate(end);
    setValidationError(null);
    void onFilterChange({ startDate: start, endDate: end });
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-3 text-lg font-semibold">Attendance History</h2>

      <div className="mb-4 flex flex-wrap items-end gap-2 border-b pb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">From</label>
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => {
              setStartDate(e.target.value);
              setValidationError(null);
            }}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">To</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => {
              setEndDate(e.target.value);
              setValidationError(null);
            }}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={handleApply}
            className="rounded-md bg-orange-600 px-3 py-1 text-sm text-white hover:bg-orange-700"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
        {validationError && (
          <p className="w-full text-xs text-red-600">{validationError}</p>
        )}
      </div>

      {attendances.length === 0 ? (
        <p className="text-gray-500">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-sm">
            <thead className="border-b text-left text-gray-500">
              <tr>
                <th className="pb-2">Date</th>
                <th className="pb-2">Clock In</th>
                <th className="pb-2">Clock Out</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2">{formatDate(r.date)}</td>
                  <td className="py-2">{formatTime(r.clockInAt)}</td>
                  <td className="py-2">
                    {r.clockOutAt ? formatTime(r.clockOutAt) : "—"}
                  </td>
                  <td className="py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${statusColor(r.status)}`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Paginator
        pageNo={pageNo}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
