import { useFollowCounts } from "@/features/follows/hooks/useFollow";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import type { ProfileStat } from "../components/ProfileHeroCard";

// Followers / Following tiles + follow-list navigation (user & astrologer dono ke liye).
export function useProfileStats(
  userId: string | undefined,
  name: string | null | undefined,
  role: "user" | "astrologer",
) {
  const router = useRouter();
  const { counts, fetchCounts } = useFollowCounts(userId);

  useEffect(() => {
    fetchCounts();
  }, [userId]);

  const open = (initialTab: "followers" | "following") =>
    router.push({
      pathname: "/(user)/follow-list",
      params: { userId, name: name ?? "You", role, initialTab },
    } as any);

  const stats: ProfileStat[] = [
    ...(role === "astrologer"
      ? [{ label: "Followers", value: counts?.followers ?? 0, onPress: () => open("followers") }]
      : []),
    { label: "Following", value: counts?.following ?? 0, onPress: () => open("following") },
  ];

  return { stats, fetchCounts };
}
