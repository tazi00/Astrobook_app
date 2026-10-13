import { apiClient } from '@/services/apiClient'
import type {
  ClaimAction,
  CancellationRequest,
  WalletBalance,
  WalletTransaction,
} from '../types'

class WalletServiceApi {
  private readonly base = '/wallet'

  async getBalance(): Promise<WalletBalance> {
    const res = await apiClient.get<WalletBalance>(`${this.base}/balance`)
    return res.data
  }

  async getTransactions(): Promise<WalletTransaction[]> {
    const res = await apiClient.get<{ transactions: WalletTransaction[] }>(
      `${this.base}/transactions`,
    )
    return res.data.transactions
  }

  async getPendingCancellations(): Promise<CancellationRequest[]> {
    const res = await apiClient.get<{ requests: CancellationRequest[] }>(
      `${this.base}/cancellation-requests/pending`,
    )
    return res.data.requests
  }

  // Booking detail page ke liye — kisi bhi status ki cancellation fetch karo
  async getCancellationByAppointment(appointmentId: string): Promise<CancellationRequest | null> {
    const res = await apiClient.get<{ cancellation: CancellationRequest | null }>(
      `${this.base}/cancellation-request/by-appointment/${appointmentId}`,
    )
    return res.data.cancellation
  }

  async claimCancellation(requestId: string, action: ClaimAction, upiId?: string): Promise<void> {
    await apiClient.post(`${this.base}/cancellation-requests/${requestId}/claim`, {
      action,
      ...(upiId ? { upiId } : {}),
    })
  }

  // Reschedule appointment — same astrologer, same service, new slot
  async rescheduleAppointment(appointmentId: string, newScheduledAt: string): Promise<void> {
    await apiClient.patch(`/consultation/appointments/${appointmentId}/reschedule`, {
      newScheduledAt,
    })
  }
}

export const walletService = new WalletServiceApi()
