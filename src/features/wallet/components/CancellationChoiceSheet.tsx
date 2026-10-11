import AppBottomSheet from '@/components/AppBottomSheet'
import { toast } from '@/components/toast'
import { AstroColors, AstroRadius, AstroSpacing } from '@/constants/astro-theme'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { walletService } from '../service'
import type { CancellationRequest, ClaimAction } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// CancellationChoiceSheet
//
// Jab astrologer ne session cancel kiya ho aur user ne abhi tak choose nahi
// kiya — refund original payment pe ya AstroBook wallet credit.
// ─────────────────────────────────────────────────────────────────────────────

function formatCountdown(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m baaki`
  return `${m} min baaki`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

type Props = {
  visible: boolean
  onClose: () => void
  request: CancellationRequest | null
  onClaimed: () => void
}

export default function CancellationChoiceSheet({
  visible,
  onClose,
  request,
  onClaimed,
}: Props) {
  const [submitting, setSubmitting] = useState(false)

  const claim = async (action: ClaimAction) => {
    if (!request) return
    setSubmitting(true)
    try {
      await walletService.claimCancellation(request.id, action)
      toast(
        action === 'refund'
          ? 'Refund shuru ho gaya — 5-7 working days mein aayega'
          : 'Amount wallet mein credit ho gaya!',
      )
      onClaimed()
      onClose()
    } catch {
      toast('Kuch gadbad hui, dobara try karo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title="Session Cancel Ho Gayi"
      heightRatio={0.62}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info strip */}
        <View style={styles.infoCard}>
          <Feather name="alert-circle" size={18} color={AstroColors.gold} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>
              {request?.appointment?.astrologerName ?? 'Astrologer'} ne session cancel kiya
            </Text>
            {request?.appointment?.scheduledAt ? (
              <Text style={styles.infoSub}>
                {formatDate(request.appointment.scheduledAt)}
              </Text>
            ) : null}
            {request?.appointment?.serviceTitle ? (
              <Text style={styles.infoSub}>{request.appointment.serviceTitle}</Text>
            ) : null}
          </View>
        </View>

        {/* Amount */}
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Refund amount</Text>
          <Text style={styles.amountValue}>
            ₹{parseFloat(request?.amount ?? '0').toFixed(0)}
          </Text>
        </View>

        {/* Countdown */}
        {request?.expiresAt ? (
          <View style={styles.timerRow}>
            <Feather name="clock" size={13} color={AstroColors.textMuted} />
            <Text style={styles.timerText}>{formatCountdown(request.expiresAt)}</Text>
          </View>
        ) : null}

        <Text style={styles.chooseLbl}>Kya karna chahte ho?</Text>

        {/* Option 1 — Wallet credit */}
        <Pressable
          style={({ pressed }) => [styles.optionCard, styles.optionWallet, pressed && styles.pressed]}
          onPress={() => claim('wallet')}
          disabled={submitting}
        >
          <View style={styles.optionIconWrap}>
            <Feather name="zap" size={22} color={AstroColors.brand} />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>AstroBook Wallet</Text>
            <Text style={styles.optionDesc}>
              Turant credit — agli booking mein seedha use karo
            </Text>
          </View>
          {submitting ? (
            <ActivityIndicator size="small" color={AstroColors.brand} />
          ) : (
            <Feather name="chevron-right" size={18} color={AstroColors.brand} />
          )}
        </Pressable>

        {/* Option 2 — Original refund */}
        <Pressable
          style={({ pressed }) => [styles.optionCard, pressed && styles.pressed]}
          onPress={() => claim('refund')}
          disabled={submitting}
        >
          <View style={styles.optionIconWrap}>
            <Feather name="credit-card" size={22} color={AstroColors.textSecondary} />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>Original Payment Pe Refund</Text>
            <Text style={styles.optionDesc}>5–7 working days mein bank/UPI mein aayega</Text>
          </View>
          {submitting ? (
            <ActivityIndicator size="small" color={AstroColors.textSecondary} />
          ) : (
            <Feather name="chevron-right" size={18} color={AstroColors.textSecondary} />
          )}
        </Pressable>

        <Text style={styles.autoNote}>
          24 ghante mein koi choice nahi kiya toh automatic refund ho jaata hai.
        </Text>
      </ScrollView>
    </AppBottomSheet>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: AstroSpacing.lg,
    gap: AstroSpacing.md,
    paddingBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    gap: AstroSpacing.sm,
    backgroundColor: AstroColors.goldTint,
    borderRadius: AstroRadius.md,
    padding: AstroSpacing.md,
    borderWidth: 1,
    borderColor: AstroColors.goldBorder,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, gap: 2 },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AstroColors.ink,
  },
  infoSub: {
    fontSize: 12,
    color: AstroColors.textSecondary,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AstroSpacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AstroColors.border,
  },
  amountLabel: {
    fontSize: 14,
    color: AstroColors.textSecondary,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '800',
    color: AstroColors.ink,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timerText: {
    fontSize: 12,
    color: AstroColors.textMuted,
  },
  chooseLbl: {
    fontSize: 13,
    fontWeight: '700',
    color: AstroColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: AstroSpacing.xs,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AstroSpacing.md,
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    padding: AstroSpacing.md,
    borderWidth: 1,
    borderColor: AstroColors.border,
  },
  optionWallet: {
    borderColor: AstroColors.brand,
    backgroundColor: AstroColors.brandTint,
  },
  pressed: { opacity: 0.75 },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AstroColors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBody: { flex: 1, gap: 3 },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AstroColors.ink,
  },
  optionDesc: {
    fontSize: 12,
    color: AstroColors.textSecondary,
    lineHeight: 17,
  },
  autoNote: {
    fontSize: 11,
    color: AstroColors.textMuted,
    textAlign: 'center',
    marginTop: AstroSpacing.xs,
    lineHeight: 16,
  },
})
