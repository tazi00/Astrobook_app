import { apiClient } from "@/services/apiClient";
import type {
  Appointment,
  AppointmentWithChildren,
  AvailabilityWindow,
  BrowsedService,
  CancelAppointmentPayload,
  ConsultationService as ConsultationServiceType,
  ConsultationServiceVariant,
  CreateAvailabilityPayload,
  CreateRecurringAvailabilityPayload,
  CreateServicePayload,
  GetSlotsQuery,
  GroupedAppointments,
  InitiateBookingPayload,
  RecurringAvailability,
  ScheduleResponse,
  TimeSlot,
  UpdateServicePayload,
  UpdateServiceVariantPayload,
} from "../types";

class ConsultationServiceApi {
  private readonly base = "/consultation";

  // ── Astrologer: Services ─────────────────────────────────────────────────

  async createService(
    dto: CreateServicePayload,
  ): Promise<ConsultationServiceType> {
    const res = await apiClient.post<{ service: ConsultationServiceType }>(
      `${this.base}/services`,
      dto,
    );
    return res.data.service;
  }

  async updateService(
    id: string,
    dto: UpdateServicePayload,
  ): Promise<ConsultationServiceType> {
    const res = await apiClient.patch<{ service: ConsultationServiceType }>(
      `${this.base}/services/${id}`,
      dto,
    );
    return res.data.service;
  }

  async getMyServices(): Promise<ConsultationServiceType[]> {
    const res = await apiClient.get<{ services: ConsultationServiceType[] }>(
      `${this.base}/services/mine`,
    );
    return res.data.services;
  }

  async deleteService(id: string): Promise<void> {
    await apiClient.delete(`${this.base}/services/${id}`);
  }

  // ── Astrologer: Service Variants ─────────────────────────────────────────

  async getServiceVariants(serviceId: string): Promise<ConsultationServiceVariant[]> {
    const res = await apiClient.get<{ variants: ConsultationServiceVariant[] }>(
      `${this.base}/services/${serviceId}/variants`,
    );
    return res.data.variants;
  }

  async updateServiceVariant(
    serviceId: string,
    variantId: string,
    dto: UpdateServiceVariantPayload,
  ): Promise<ConsultationServiceVariant> {
    const res = await apiClient.patch<{ variant: ConsultationServiceVariant }>(
      `${this.base}/services/${serviceId}/variants/${variantId}`,
      dto,
    );
    return res.data.variant;
  }

  // ── Astrologer: Availability ─────────────────────────────────────────────

  async setAvailability(
    dto: CreateAvailabilityPayload,
  ): Promise<AvailabilityWindow> {
    const res = await apiClient.post<{ availability: AvailabilityWindow }>(
      `${this.base}/availability`,
      dto,
    );
    return res.data.availability;
  }

  async getMyAvailability(): Promise<AvailabilityWindow[]> {
    const res = await apiClient.get<{ availability: AvailabilityWindow[] }>(
      `${this.base}/availability/mine`,
    );
    return res.data.availability;
  }

  async deleteAvailability(id: string): Promise<void> {
    await apiClient.delete(`${this.base}/availability/${id}`);
  }

  // ── Astrologer: Recurring Availability ──────────────────────────────────

  /**
   * Ek saath multiple days set karo (Mon/Wed/Fri chips se).
   * Backend Promise.allSettled use karta hai — {created, failed} milta hai.
   */
  async setRecurringAvailability(
    dto: CreateRecurringAvailabilityPayload,
  ): Promise<{ created: number; failed: number }> {
    const res = await apiClient.post<{ created: number; failed: number }>(
      `${this.base}/availability/recurring`,
      dto,
    );
    return res.data;
  }

  async getMyRecurringAvailability(): Promise<RecurringAvailability[]> {
    const res = await apiClient.get<{ recurring: RecurringAvailability[] }>(
      `${this.base}/availability/recurring/mine`,
    );
    return res.data.recurring;
  }

  async deleteRecurringAvailability(id: string): Promise<void> {
    await apiClient.delete(`${this.base}/availability/recurring/${id}`);
  }

  // ── Astrologer: Schedule ─────────────────────────────────────────────────

  async getSchedule(date?: string): Promise<ScheduleResponse> {
    const res = await apiClient.get<ScheduleResponse>(
      `${this.base}/schedule`,
      date ? { params: { date } } : undefined,
    );
    return res.data;
  }

  // ── User: Browse astrologer services / slots ─────────────────────────────

  async getAstrologerServices(
    astrologerId: string,
  ): Promise<ConsultationServiceType[]> {
    const res = await apiClient.get<{ services: ConsultationServiceType[] }>(
      `${this.base}/astrologers/${astrologerId}/services`,
    );
    return res.data.services;
  }

  async getAvailableDates(astrologerId: string): Promise<string[]> {
    const res = await apiClient.get<{ dates: string[] }>(
      `${this.base}/astrologers/${astrologerId}/available-dates`,
    );
    return res.data.dates;
  }

  async getSlots(query: GetSlotsQuery): Promise<TimeSlot[]> {
    const res = await apiClient.get<{ slots: TimeSlot[] }>(
      `${this.base}/slots`,
      { params: query },
    );
    return res.data.slots;
  }

  // ── Slot Locks (soft lock — Book My Show style) ──────────────────────────

  /**
   * Slot ko 10 min ke liye soft-lock karo. Returns null agar kisi aur ne
   * already lock kar rakha hai (user ko retry message dikhao).
   */
  async lockSlot(astrologerId: string, slotStart: string): Promise<boolean> {
    try {
      await apiClient.post(`${this.base}/slots/lock`, { astrologerId, slotStart });
      return true;
    } catch {
      return false; // conflict — kisi aur ka lock hai
    }
  }

  async releaseSlot(astrologerId: string, slotStart: string): Promise<void> {
    try {
      await apiClient.delete(`${this.base}/slots/lock`, {
        data: { astrologerId, slotStart },
      });
    } catch {
      // Best-effort — agar request fail ho toh TTL expire hone pe auto-release
    }
  }

  async releaseAllLocks(): Promise<void> {
    try {
      await apiClient.delete(`${this.base}/slots/lock/all`);
    } catch {
      // Best-effort
    }
  }

  // Explore category detail page — kisi bhi astrologer ki us tag wali services
  async browseByTag(
    tag: string,
    limit = 20,
    offset = 0,
  ): Promise<{ services: BrowsedService[]; hasMore: boolean }> {
    const res = await apiClient.get<{
      services: BrowsedService[];
      hasMore: boolean;
    }>(`${this.base}/services/browse`, { params: { tag, limit, offset } });
    return res.data;
  }

  // ── Booking ───────────────────────────────────────────────────────────────

  async initiateBooking(dto: InitiateBookingPayload): Promise<Appointment> {
    const res = await apiClient.post<{ appointment: Appointment }>(
      `${this.base}/appointments/initiate`,
      dto,
    );
    return res.data.appointment;
  }

  // Note: response data IS the grouped object directly (not wrapped in
  // { appointments: ... }) — matches appointment.repository.ts findMineGrouped()
  async getMyAppointments(): Promise<GroupedAppointments> {
    const res = await apiClient.get<GroupedAppointments>(
      `${this.base}/appointments/mine`,
    );
    return res.data;
  }

  async getAppointmentById(id: string): Promise<AppointmentWithChildren> {
    const res = await apiClient.get<{ appointment: AppointmentWithChildren }>(
      `${this.base}/appointments/${id}`,
    );
    return res.data.appointment;
  }

  async cancelAppointment(
    id: string,
    dto?: CancelAppointmentPayload,
  ): Promise<void> {
    await apiClient.patch(`${this.base}/appointments/${id}/cancel`, dto);
  }

  async joinSession(
    id: string,
  ): Promise<{ appointment: AppointmentWithChildren; agora: { token: string; channel: string } }> {
    const res = await apiClient.post<{
      appointment: AppointmentWithChildren;
      agora: { token: string; channel: string };
    }>(`${this.base}/appointments/${id}/join`);
    return res.data;
  }

  async endSession(id: string): Promise<void> {
    await apiClient.post(`${this.base}/appointments/${id}/end`);
  }

  // Agora token 1 hour mein expire hota hai — lambe (90-min) sessions mein
  // beech mein renew karna padta hai. onTokenPrivilegeWillExpire fire hone
  // pe session screen ye call karke naya token engine ko renewToken() se
  // deta hai (call disconnect nahi hoti).
  async renewAgoraToken(
    id: string,
  ): Promise<{ token: string; channel: string }> {
    const res = await apiClient.post<{ agora: { token: string; channel: string } }>(
      `${this.base}/appointments/${id}/renew-token`,
    );
    return res.data.agora;
  }
}

export const consultationService = new ConsultationServiceApi();