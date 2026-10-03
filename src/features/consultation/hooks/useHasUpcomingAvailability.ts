import { useQuery } from "@tanstack/react-query";
import { consultationService } from "../service";
import type { AvailabilityWindow } from "../types";

// Aaj (abhi se aage) ya future ki koi active window hai ya nahi — dashboard
// ka "Availability set karo" nudge sirf tab dikhana hai jab sach mein koi
// slot set nahi hai.
export function hasUpcomingWindow(windows: AvailabilityWindow[], now = new Date()): boolean {
  const pad = (n: number) => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return windows.some(
    (w) =>
      w.isActive &&
      (w.date > today || (w.date === today && w.endTime.slice(0, 5) > time)),
  );
}

export function useHasUpcomingAvailability() {
  const q = useQuery({
    queryKey: ["availability", "mine"],
    queryFn: () => consultationService.getMyAvailability(),
    staleTime: 0,
  });
  return {
    // undefined = abhi pata nahi (loading/error) — tab nudge mat dikhao
    hasAvailability: q.data ? hasUpcomingWindow(q.data) : undefined,
    refetch: q.refetch,
  };
}
