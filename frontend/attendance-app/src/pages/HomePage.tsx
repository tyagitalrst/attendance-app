import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import * as attendanceApi from "../api/attendance";
import type { Attendance } from "../types/attendance";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { TodayAttendanceCard } from "../components/dashboard/TodayAttendanceCard";
import { Spinner } from "../components/common/Spinner";
import axios from "axios";
import { format } from "date-fns";

export function HomePage() {
  const { user } = useAuth();
  const [today, setToday] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchToday() {
    try {
      const now = new Date();
      const records = await attendanceApi.getAttendances({
        startDate: format(now, "yyyy-MM-dd"),
        endDate: format(now, "yyyy-MM-dd"),
      });
      const todayRecord = records?.data[0];

      setToday(todayRecord ?? null);
    } catch {
      setError("Failed to load attendances");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchToday();
  }, []);

  async function handleClockIn() {
    setActionLoading(true);
    setError(null);
    try {
      await attendanceApi.clockIn();
      await fetchToday();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Clock-in failed");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClockOut() {
    setActionLoading(true);
    setError(null);
    try {
      await attendanceApi.clockOut();
      await fetchToday();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Clock-out failed");
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} />
      <TodayAttendanceCard
        today={today}
        error={error}
        actionLoading={actionLoading}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
      />
    </div>
  );
}
