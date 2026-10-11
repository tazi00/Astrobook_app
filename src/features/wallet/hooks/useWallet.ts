import { useCallback, useEffect, useState } from 'react'
import { walletService } from '../service'
import type { CancellationRequest, WalletBalance, WalletTransaction } from '../types'

// ── useWalletBalance ─────────────────────────────────────────────────────────
export function useWalletBalance() {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const data = await walletService.getBalance()
      setBalance(data)
    } catch {
      // silent — screen apna error dikhayegi
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { balance, loading, refetch: fetch }
}

// ── useWalletTransactions ────────────────────────────────────────────────────
export function useWalletTransactions() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetch = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const data = await walletService.getTransactions()
      setTransactions(data)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { transactions, loading, refreshing, refetch: (r?: boolean) => fetch(r) }
}

// ── usePendingCancellations ──────────────────────────────────────────────────
export function usePendingCancellations() {
  const [requests, setRequests] = useState<CancellationRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const data = await walletService.getPendingCancellations()
      setRequests(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { requests, loading, refetch: fetch }
}
