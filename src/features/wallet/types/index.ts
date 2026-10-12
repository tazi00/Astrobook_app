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
  status: 'pending' | 'refunded' | 'credited' | 'timing_changed'
  // Kisne cancel kiya — 'astrologer' → 2 options; 'user' → 3 options (incl. timing change)
  initiatedBy: 'astrologer' | 'user'
  expiresAt: string
  createdAt: string
  appointment?: {
    scheduledAt: string
    // Slot picker ke liye — getAvailableDates() + getSlots() calls
    astrologerId: string
    serviceId: string
    // Optional display-only fields (filled if API joins extra tables)
    astrologerName?: string
    serviceTitle?: string
  }
}

export type ClaimAction = 'refund' | 'wallet'
