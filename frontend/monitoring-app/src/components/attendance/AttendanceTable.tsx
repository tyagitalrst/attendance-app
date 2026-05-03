import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import type { Attendance, FilterAttendance } from "../../types/attendance";
import { Spinner } from "../common/Spinner";
import { formatDate, formatTime } from "../../utils/date";
import { statusColor } from "../../utils/statusColor";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  records: (Attendance & { user?: any })[];
  loading: boolean;
  onFilterChange: (filter: FilterAttendance) => void;
}

function currentMonthRange() {
  const now = new Date();
  return {
    start: format(startOfMonth(now), "yyyy-MM-dd"),
    end: format(endOfMonth(now), "yyyy-MM-dd"),
  };
}

export function AttendanceTable({ records, loading, onFilterChange }: Props) {
  const { start, end } = currentMonthRange();
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    onFilterChange({ startDate: start, endDate: end });
  }, []);

  function handleApply() {
    if (!startDate || !endDate) {
      setValidationError("Both From and To dates are required.");
      return;
    }
    setValidationError(null);
    onFilterChange({ startDate, endDate });
  }

  function handleReset() {
    setStartDate(start);
    setEndDate(end);
    setValidationError(null);
    onFilterChange({ startDate: start, endDate: end });
  }

  return (
    <div className="overflow-hidden">
      <div className="border-b p-4">
        <div className="flex flex-wrap items-end gap-2">
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
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Clock In</th>
            <th className="px-4 py-3">Clock Out</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="flex justify-center p-4 text-center">
                <Spinner />
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {r.user?.name ?? `User #${r.userId}`}
                </td>
                <td className="px-4 py-3">{formatDate(r.date)}</td>
                <td className="px-4 py-3">{formatTime(r.clockInAt)}</td>
                <td className="px-4 py-3">
                  {r.clockOutAt ? formatTime(r.clockOutAt) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${statusColor(r.status)}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
