import { useEffect, useState } from "react";
import type { Attendance } from "../../types/attendance";
import { formatTime } from "../../utils/date";

interface Props {
  today: Attendance | null;
  error: string | null;
  actionLoading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
}

export function TodayAttendanceCard({
  today,
  error,
  actionLoading,
  onClockIn,
  onClockOut,
}: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hasClockedIn = !!today;
  const hasClockedOut = !!today?.clockOutAt;

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-400 p-6 text-black shadow-lg">
      <p className="mb-1 text-sm text-orange-500 font-bold">Today</p>
      <p className="mb-4 text-2xl font-bold">{formatTime(now)}</p>

      {error && (
        <div className="mb-3 rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {hasClockedIn ? (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-black-100">Clocked in</span>
            <span className="font-medium">
              {formatTime(today!.clockInAt!)}
              <span
                className={`ml-2 rounded px-2 py-0.5 text-xs ${
                  today!.status === "LATE"
                    ? "bg-orange-300 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {today!.status}
              </span>
            </span>
          </div>
          {hasClockedOut ? (
            <div className="flex justify-between text-sm">
              <span className="text-black-100">Clocked Out</span>
              <span className="font-medium">
                {formatTime(today!.clockOutAt!)}
              </span>
            </div>
          ) : (
            <button
              onClick={onClockOut}
              disabled={actionLoading}
              className="rounded-3xl bg-orange-700  px-4 py-2 font-medium text-white hover:bg-orange-400 disabled:opacity-50"
            >
              {actionLoading ? "..." : "Clock Out"}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={onClockIn}
          disabled={actionLoading}
          className="w-full rounded-3xl bg-white px-6 py-3 font-medium text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
        >
          {actionLoading ? "..." : "Clock In Now"}
        </button>
      )}
    </div>
  );
}
