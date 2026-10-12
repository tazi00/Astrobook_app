import AppBottomSheet from '@/components/AppBottomSheet'
import { toast } from '@/components/toast'
import { AstroColors, AstroRadius, AstroSpacing } from '@/constants/astro-theme'
import { consultationService } from '@/features/consultation/service'
import type { TimeSlot } from '@/features/consultation/types'
import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
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
// Jab session cancel ho aur user ne abhi tak choose nahi kiya.
//
// initiatedBy === 'astrologer' → 2 options  (refund | wallet)
// initiatedBy === 'user'       → 3 options  (refund | wallet | change timing)
//
// "Change Timing" flow: date pick → slot pick → confirm reschedule
// ─────────────────────────────────────────────────────────────────────────────

type Step = 'choice' | 'date' | 'slots' | 'confirm'

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

function formatDateLabel(dateStr: string) {
  // dateStr is 'YYYY-MM-DD'
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatSlotTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
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
  const isUserCancel = request?.initiatedBy === 'user'

  const [step, setStep] = useState<Step>('choice')
  const [submitting, setSubmitting] = useState(false)

  // Date-picker state
  const [dates, setDates] = useState<string[]>([])
  const [datesLoading, setDatesLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Slot-picker state
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // Reset everything when sheet opens/closes
  useEffect(() => {
    if (!visible) {
      setStep('choice')
      setDates([])
      setSelectedDate(null)
      setSlots([])
      setSelectedSlot(null)
    }
  }, [visible])

  // ── Claim (refund or wallet) ──────────────────────────────────────────────

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

  // ── Change Timing — step 1 → 2 ────────────────────────────────────────────

  const openDatePicker = async () => {
    const astrologerId = request?.appointment?.astrologerId
    if (!astrologerId) {
      toast('Appointment details nahi mile — try again')
      return
    }
    setDatesLoading(true)
    setStep('date')
    try {
      const data = await consultationService.getAvailableDates(astrologerId)
      // Filter past dates
      const today = new Date().toISOString().slice(0, 10)
      setDates(data.filter((d) => d >= today))
    } catch {
      toast('Dates fetch nahi hui — dobara try karo')
      setStep('choice')
    } finally {
      setDatesLoading(false)
    }
  }

  // ── Date selected → step 3 ────────────────────────────────────────────────

  const onDateSelect = async (date: string) => {
    const astrologerId = request?.appointment?.astrologerId
    const serviceId = request?.appointment?.serviceId
    if (!astrologerId || !serviceId) return

    setSelectedDate(date)
    setSlotsLoading(true)
    setStep('slots')
    setSlots([])
    setSelectedSlot(null)

    try {
      const data = await consultationService.getSlots({ astrologerId, serviceId, date })
      setSlots(data)
    } catch {
      toast('Slots fetch nahi hui — dobara try karo')
      setStep('date')
    } finally {
      setSlotsLoading(false)
    }
  }

  // ── Slot selected → step 4 ────────────────────────────────────────────────

  const onSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setStep('confirm')
  }

  // ── Confirm reschedule ────────────────────────────────────────────────────

  const confirmReschedule = async () => {
    if (!request || !selectedSlot) return
    setSubmitting(true)
    try {
      await walletService.rescheduleAppointment(
        request.appointmentId,
        selectedSlot.startTime,
      )
      toast('Session reschedule ho gaya!')
      onClaimed()
      onClose()
    } catch (err: any) {
      const msg: string = err?.response?.data?.message ?? ''
      if (msg.includes('week')) toast('Is hafte ek baar hi reschedule ho sakta hai')
      else if (msg.includes('month')) toast('Is mahine 2 baar reschedule ho chuka hai')
      else if (msg.includes('already rescheduled')) toast('Ye booking pehle reschedule ho chuki hai')
      else if (msg.includes('conflict')) toast('Ye slot already book hai, dusra chuno')
      else toast('Reschedule nahi hua — dobara try karo')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Height based on step ──────────────────────────────────────────────────

  const heightRatio =
    step === 'choice' ? (isUserCancel ? 0.72 : 0.62)
    : step === 'date'    ? 0.60
    : step === 'slots'   ? 0.72
    : 0.52 // confirm

  // ── Titles ───────────────────────────────────────────────────────────────

  const sheetTitle =
    step === 'choice'
      ? isUserCancel ? 'Aapne Session Cancel Kiya' : 'Session Cancel Ho Gayi'
      : step === 'date'
      ? 'Naya Din Chuno'
      : step === 'slots'
      ? 'Slot Chuno'
      : 'Reschedule Confirm Karo'

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      title={sheetTitle}
      heightRatio={heightRatio}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── STEP: CHOICE ─────────────────────────────────────────────── */}
        {step === 'choice' && (
          <>
            {/* Info strip */}
            <View style={styles.infoCard}>
              <Feather name="alert-circle" size={18} color={AstroColors.gold} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>
                  {isUserCancel
                    ? 'Aapne ye session cancel kiya tha'
                    : `${request?.appointment?.astrologerName ?? 'Astrologer'} ne session cancel kiya`}
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

            {/* Option: Wallet credit */}
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
              {submitting
                ? <ActivityIndicator size="small" color={AstroColors.brand} />
                : <Feather name="chevron-right" size={18} color={AstroColors.brand} />}
            </Pressable>

            {/* Option: Original refund */}
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
              {submitting
                ? <ActivityIndicator size="small" color={AstroColors.textSecondary} />
                : <Feather name="chevron-right" size={18} color={AstroColors.textSecondary} />}
            </Pressable>

            {/* Option: Change timing — only for user-cancel + appointment meta available */}
            {isUserCancel && request?.appointment?.astrologerId ? (
              <Pressable
                style={({ pressed }) => [styles.optionCard, styles.optionReschedule, pressed && styles.pressed]}
                onPress={openDatePicker}
                disabled={submitting}
              >
                <View style={styles.optionIconWrap}>
                  <Feather name="calendar" size={22} color={AstroColors.successDark} />
                </View>
                <View style={styles.optionBody}>
                  <Text style={styles.optionTitle}>Timing Badlo</Text>
                  <Text style={styles.optionDesc}>
                    Same astrologer, same service — naya slot chuno, koi extra charge nahi
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={AstroColors.successDark} />
              </Pressable>
            ) : null}

            <Text style={styles.autoNote}>
              24 ghante mein koi choice nahi kiya toh automatic refund ho jaata hai.
            </Text>
          </>
        )}

        {/* ── STEP: DATE PICKER ────────────────────────────────────────── */}
        {step === 'date' && (
          <>
            <Text style={styles.stepHint}>
              Kaunsa din chahiye? (Same astrologer ke available dates)
            </Text>
            {datesLoading ? (
              <ActivityIndicator color={AstroColors.brand} style={{ marginTop: 24 }} />
            ) : dates.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Feather name="calendar" size={32} color={AstroColors.border} />
                <Text style={styles.emptyText}>
                  Abhi koi available date nahi — baad mein try karo
                </Text>
                <Pressable
                  style={[styles.backBtn, { marginTop: AstroSpacing.md }]}
                  onPress={() => setStep('choice')}
                >
                  <Text style={styles.backBtnText}>Wapas Jao</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {dates.map((date) => (
                  <Pressable
                    key={date}
                    style={({ pressed }) => [
                      styles.dateRow,
                      selectedDate === date && styles.dateRowSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => onDateSelect(date)}
                  >
                    <Feather
                      name="calendar"
                      size={16}
                      color={selectedDate === date ? AstroColors.brand : AstroColors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.dateLabel,
                        selectedDate === date && styles.dateLabelSelected,
                      ]}
                    >
                      {formatDateLabel(date)}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={16}
                      color={selectedDate === date ? AstroColors.brand : AstroColors.border}
                    />
                  </Pressable>
                ))}
                <Pressable style={styles.backBtn} onPress={() => setStep('choice')}>
                  <Text style={styles.backBtnText}>← Wapas</Text>
                </Pressable>
              </>
            )}
          </>
        )}

        {/* ── STEP: SLOT PICKER ────────────────────────────────────────── */}
        {step === 'slots' && (
          <>
            <Text style={styles.stepHint}>
              {selectedDate ? formatDateLabel(selectedDate) : ''} ke available slots:
            </Text>
            {slotsLoading ? (
              <ActivityIndicator color={AstroColors.brand} style={{ marginTop: 24 }} />
            ) : slots.filter((s) => s.available).length === 0 ? (
              <View style={styles.emptyWrap}>
                <Feather name="clock" size={32} color={AstroColors.border} />
                <Text style={styles.emptyText}>
                  Is din koi slot available nahi — dusra din chuno
                </Text>
                <Pressable
                  style={[styles.backBtn, { marginTop: AstroSpacing.md }]}
                  onPress={() => setStep('date')}
                >
                  <Text style={styles.backBtnText}>← Aur Dates Dekho</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.slotsGrid}>
                  {slots.filter((s) => s.available).map((slot) => (
                    <Pressable
                      key={slot.startTime}
                      style={({ pressed }) => [
                        styles.slotChip,
                        slot.softLocked && styles.slotChipSoftLocked,
                        selectedSlot?.startTime === slot.startTime && styles.slotChipSelected,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => onSlotSelect(slot)}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          slot.softLocked && styles.slotTextMuted,
                          selectedSlot?.startTime === slot.startTime && styles.slotTextSelected,
                        ]}
                      >
                        {formatSlotTime(slot.startTime)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable style={styles.backBtn} onPress={() => setStep('date')}>
                  <Text style={styles.backBtnText}>← Aur Dates Dekho</Text>
                </Pressable>
              </>
            )}
          </>
        )}

        {/* ── STEP: CONFIRM ────────────────────────────────────────────── */}
        {step === 'confirm' && selectedSlot && (
          <>
            <View style={styles.confirmCard}>
              <Feather name="check-circle" size={36} color={AstroColors.success} />
              <Text style={styles.confirmTitle}>Naya Slot</Text>
              <Text style={styles.confirmSlot}>
                {selectedDate ? formatDateLabel(selectedDate) : ''}
              </Text>
              <Text style={styles.confirmTime}>
                {formatSlotTime(selectedSlot.startTime)}
              </Text>
              <Text style={styles.confirmNote}>
                Same astrologer · same service · same price
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.confirmBtn,
                submitting && styles.confirmBtnDisabled,
                pressed && !submitting && styles.pressed,
              ]}
              onPress={confirmReschedule}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.confirmBtnText}>Confirm Reschedule</Text>}
            </Pressable>

            <Pressable style={styles.backBtn} onPress={() => setStep('slots')}>
              <Text style={styles.backBtnText}>← Aur Slots Dekho</Text>
            </Pressable>
          </>
        )}
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

  // ── Info card ─────────────────────────────────────────────────────────────
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

  // ── Amount ────────────────────────────────────────────────────────────────
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

  // ── Timer ─────────────────────────────────────────────────────────────────
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timerText: {
    fontSize: 12,
    color: AstroColors.textMuted,
  },

  // ── Section label ─────────────────────────────────────────────────────────
  chooseLbl: {
    fontSize: 13,
    fontWeight: '700',
    color: AstroColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: AstroSpacing.xs,
  },

  // ── Option cards ──────────────────────────────────────────────────────────
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
  optionReschedule: {
    borderColor: AstroColors.success,
    backgroundColor: AstroColors.successTint,
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

  // ── Footer note ───────────────────────────────────────────────────────────
  autoNote: {
    fontSize: 11,
    color: AstroColors.textMuted,
    textAlign: 'center',
    marginTop: AstroSpacing.xs,
    lineHeight: 16,
  },

  // ── Step hint ─────────────────────────────────────────────────────────────
  stepHint: {
    fontSize: 13,
    color: AstroColors.textSecondary,
    marginBottom: AstroSpacing.xs,
  },

  // ── Date rows ─────────────────────────────────────────────────────────────
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AstroSpacing.sm,
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.md,
    padding: AstroSpacing.md,
    borderWidth: 1,
    borderColor: AstroColors.border,
  },
  dateRowSelected: {
    borderColor: AstroColors.brand,
    backgroundColor: AstroColors.brandTint,
  },
  dateLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AstroColors.ink,
  },
  dateLabelSelected: {
    color: AstroColors.brand,
  },

  // ── Slot grid ─────────────────────────────────────────────────────────────
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AstroSpacing.sm,
  },
  slotChip: {
    paddingHorizontal: AstroSpacing.md,
    paddingVertical: AstroSpacing.sm,
    borderRadius: AstroRadius.sm,
    backgroundColor: AstroColors.surface,
    borderWidth: 1,
    borderColor: AstroColors.border,
    minWidth: 90,
    alignItems: 'center',
  },
  slotChipSelected: {
    backgroundColor: AstroColors.brandTint,
    borderColor: AstroColors.brand,
  },
  slotChipSoftLocked: {
    opacity: 0.45,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: AstroColors.ink,
  },
  slotTextSelected: {
    color: AstroColors.brand,
  },
  slotTextMuted: {
    color: AstroColors.textMuted,
  },

  // ── Confirm step ──────────────────────────────────────────────────────────
  confirmCard: {
    alignItems: 'center',
    gap: AstroSpacing.xs,
    paddingVertical: AstroSpacing.lg,
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.lg,
    borderWidth: 1,
    borderColor: AstroColors.border,
  },
  confirmTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AstroColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: AstroSpacing.sm,
  },
  confirmSlot: {
    fontSize: 16,
    fontWeight: '700',
    color: AstroColors.ink,
    marginTop: 2,
  },
  confirmTime: {
    fontSize: 28,
    fontWeight: '900',
    color: AstroColors.ink,
  },
  confirmNote: {
    fontSize: 11,
    color: AstroColors.textMuted,
    marginTop: 4,
  },
  confirmBtn: {
    backgroundColor: AstroColors.brand,
    borderRadius: AstroRadius.md,
    padding: AstroSpacing.md,
    alignItems: 'center',
    marginTop: AstroSpacing.xs,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },

  // ── Back button ───────────────────────────────────────────────────────────
  backBtn: {
    alignSelf: 'center',
    paddingVertical: AstroSpacing.sm,
    paddingHorizontal: AstroSpacing.md,
    marginTop: AstroSpacing.xs,
  },
  backBtnText: {
    fontSize: 13,
    color: AstroColors.textSecondary,
    fontWeight: '600',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: AstroColors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
})
