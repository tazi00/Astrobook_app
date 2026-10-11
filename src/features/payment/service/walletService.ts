import { apiClient } from "@/services/apiClient";
import type {
  ClaimCancellationPayload,
  CancellationRequest,
  WalletBalance,
  WalletTransaction,
} from "@/features/consultation/types";

class WalletServiceApi {
  private readonly base = "/wallet";
  private readonly cancellationBase = "/consultation/appointments";

  // ── Wallet ───────────────────────────────────────────────────────────────

  async getBalance(): Promise<WalletBalance> {
    const res = await apiClient.get<{ wallet: WalletBalance }>(
      `${this.base}/balance`,
    );
    return res.data.wallet;
  }

  async getTransactions(): Promise<WalletTransaction[]> {
    const res = await apiClient.get<{ transactions: WalletTransaction[] }>(
      `${this.base}/transactions`,
    );
    return res.data.transactions;
  }

  // ── Cancellation claims ──────────────────────────────────────────────────
  // User ke paas 24h ka window hai — refund ya wallet credit choose karne ke liye.
  // Action nahi liya toh backend auto-refund kar deta hai.

  async getPendingCancellations(): Promise<CancellationRequest[]> {
    const res = await apiClient.get<{ requests: CancellationRequest[] }>(
      `${this.base}/cancellation-requests/pending`,
    );
    return res.data.requests;
  }

  async claimCancellation(
    requestId: string,
    dto: ClaimCancellationPayload,
  ): Promise<CancellationRequest> {
    const res = await apiClient.post<{ request: CancellationRequest }>(
      `${this.base}/cancellation-requests/${requestId}/claim`,
      dto,
    );
    return res.data.request;
  }
}

export const walletService = new WalletServiceApi();
