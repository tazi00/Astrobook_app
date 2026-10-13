export type WalletBalance = {
  balance: string
  currency: string
}

export type WalletTransaction = {
  id: string
  amount: string
  type: 'credit' | 'debit'
  source: 'cancellation_refund' | 'manual' | 'booking_payment'
  description: string | null
  createdAt: string
}

export type CancellationRequestStatus =
  | 'pending'
  | 'refunded'
  | 'credited'
  | 'timing_changed'
  | 'admin_pending_money'
  | 'admin_pending_wallet'
  | 'admin_approved'
  | 'admin_rejected'

export type CancellationRequest = {
  id: string
  appointmentId: string
  amount: string
  deductionAmount: string  // '0' or '50'
  upiId?: string | null
  razorpayPaymentId?: string | null
  status: CancellationRequestStatus
  // Kisne cancel kiya — 'astrologer' → 2 options; 'user' → same 2 options
  initiatedBy: 'astrologer' | 'user'
  expiresAt: string
  createdAt: string
  appointment?: {
    scheduledAt: string
    astrologerId: string
    serviceId: string
    // Optional display-only fields (filled if API joins extra tables)
    astrologerName?: string
    serviceTitle?: string
  }
}

export type ClaimAction = 'refund' | 'wallet'
