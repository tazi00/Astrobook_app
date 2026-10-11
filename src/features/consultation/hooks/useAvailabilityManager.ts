import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { consultationService } from "../service";
import type { AvailabilityWindow, RecurringAvailability } from "../types";

// Dashboard ka useHasUpcomingAvailability bhi yahi key use karta hai — isliye
// slot add/delete hote hi dashboard ka nudge apne aap sahi ho jaata hai.
export const AVAILABILITY_KEY = ["availability", "mine"] as const;
export const RECURRING_AVAILABILITY_KEY = ["availability", "recurring", "mine"] as const;

export function useAvailabilityManager() {
  const qc = useQueryClient();

  // ── Specific-date windows ────────────────────────────────────────────────
  const query = useQuery({
    queryKey: AVAILABILITY_KEY,
    queryFn: () => consultationService.getMyAvailability(),
    staleTime: 0,
  });

  const create = useMutation({
    // Ek slot har chune hue din ke liye. Kuch fail ho toh baaki phir bhi bante hain.
    mutationFn: async (input: { dates: string[]; startTime: string; endTime: string }) => {
      const results = await Promise.allSettled(
        input.dates.map((date) =>
          consultationService.setAvailability({
            date,
            startTime: input.startTime,
            endTime: input.endTime,
          }),
        ),
      );
      return {
        created: results.filter((r) => r.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
      };
    },
    onSettled: () => qc.invalidateQueries({ queryKey: AVAILABILITY_KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => consultationService.deleteAvailability(id),
    onSuccess: (_d, id) =>
      qc.setQueryData<AvailabilityWindow[]>(AVAILABILITY_KEY, (prev) =>
        prev?.filter((w) => w.id !== id),
      ),
    onSettled: () => qc.invalidateQueries({ queryKey: AVAILABILITY_KEY }),
  });

  // ── Recurring patterns ───────────────────────────────────────────────────
  const recurringQuery = useQuery({
    queryKey: RECURRING_AVAILABILITY_KEY,
    queryFn: () => consultationService.getMyRecurringAvailability(),
    staleTime: 0,
  });

  const createRecurring = useMutation({
    mutationFn: (input: { daysOfWeek: number[]; startTime: string; endTime: string }) =>
      consultationService.setRecurringAvailability(input),
    onSettled: () => qc.invalidateQueries({ queryKey: RECURRING_AVAILABILITY_KEY }),
  });

  const removeRecurring = useMutation({
    mutationFn: (id: string) => consultationService.deleteRecurringAvailability(id),
    onSuccess: (_d, id) =>
      qc.setQueryData<RecurringAvailability[]>(RECURRING_AVAILABILITY_KEY, (prev) =>
        prev?.filter((r) => r.id !== id),
      ),
    onSettled: () => qc.invalidateQueries({ queryKey: RECURRING_AVAILABILITY_KEY }),
  });

  return {
    // Specific-date
    windows: query.data ?? [],
    loading: query.isLoading,
    refreshing: query.isRefetching,
    error: query.isError && !query.data,
    refetch: query.refetch,
    create,
    remove,

    // Recurring
    recurringPatterns: recurringQuery.data ?? [],
    recurringLoading: recurringQuery.isLoading,
    createRecurring,
    removeRecurring,
  };
}