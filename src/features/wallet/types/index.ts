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

export type CancellationRequest = {
  id: string
  appointmentId: string
  amount: string
  razorpayPaymentId: string
  status: 'pending' | 'refunded' | 'credited'
  expiresAt: string
  createdAt: string
  appointment?: {
    scheduledAt: string
    astrologerName: string
    serviceTitle: string
  }
}

export type ClaimAction = 'refund' | 'wallet'
