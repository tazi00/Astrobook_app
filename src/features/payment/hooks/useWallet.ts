import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ClaimCancellationPayload } from "@/features/consultation/types";
import { walletService } from "../service/walletService";

export const WALLET_BALANCE_KEY = ["wallet", "balance"] as const;
export const PENDING_CANCELLATIONS_KEY = ["wallet", "cancellations", "pending"] as const;

export function useWalletBalance() {
  const query = useQuery({
    queryKey: WALLET_BALANCE_KEY,
    queryFn: () => walletService.getBalance(),
    staleTime: 30_000, // 30s — balance kabhi kabhi update hota hai
  });

  return {
    balance: query.data ?? null,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}

export function usePendingCancellations() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: PENDING_CANCELLATIONS_KEY,
    queryFn: () => walletService.getPendingCancellations(),
    staleTime: 0,
  });

  const claim = useMutation({
    mutationFn: ({
      requestId,
      dto,
    }: {
      requestId: string;
      dto: ClaimCancellationPayload;
    }) => walletService.claimCancellation(requestId, dto),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: PENDING_CANCELLATIONS_KEY });
      qc.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
    },
  });

  return {
    pendingCancellations: query.data ?? [],
    loading: query.isLoading,
    refetch: query.refetch,
    claim,
  };
}
