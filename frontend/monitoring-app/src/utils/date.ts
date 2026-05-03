import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

export function formatTime(date: string | Date): string {
  return format(toZonedTime(new Date(date), TIMEZONE), "HH:mm");
}

export function formatDate(date: string | Date): string {
  return format(toZonedTime(new Date(date), TIMEZONE), "dd MMM yyyy");
}
