import { apiClient } from "@/services/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type KundliDosha = {
  name: string;
  type?: string | null;
  active: boolean;
  detail?: string;
};

export type KundliChart = {
  lagna: string | null;
  lagnaLord: string | null;
  lagnaDegree: string | null;
  rashi: string | null;
  rashiLord: string | null;
  sunSign: string | null;
  nakshatra: string | null;
  nakshatraPada: number | null;
};

export type KundliDasha = {
  mahadasha: string | null;
  antardasha: string | null;
  pratyantar: string | null;
  mahadashaEnds: string | null;
  antardashaEnds: string | null;
  timeline: any[] | null;
};

export type KundliData = {
  id: string;
  generatedAt: string | null;
  chart: KundliChart;
  dasha: KundliDasha;
  doshas: KundliDosha[];
  hasDoshas: boolean;
  planets: Record<string, any> | null;
  houses: Record<string, any> | null;
  birth: {
    date: string | null;
    time: string | null;
    place: string | null;
  };
  isPublic: boolean;
  shareToken: string | null;
  shareUrl: string | null;
};

export type SaveBirthDetailsPayload = {
  birthDate: string;   // YYYY-MM-DD
  birthTime: string;   // HH:MM:SS
  birthPlace: string;
  birthLat?: number;
  birthLng?: number;
};

export type GenerateKundliPayload = SaveBirthDetailsPayload | Record<string, never>;

// ─── Service ──────────────────────────────────────────────────────────────────

class KundliService {
  async getMyKundli(): Promise<KundliData | null> {
    try {
      const res = await apiClient.get<{ kundli: KundliData }>("/kundli/me");
      return (res as any).kundli ?? null;
    } catch (err: any) {
      // 404 = Kundli nahi bani abhi — null return karo
      if (err?.response?.status === 404) return null;
      throw err;
    }
  }

  async generateKundli(payload?: GenerateKundliPayload): Promise<KundliData> {
    const res = await apiClient.post<{ kundli: KundliData }>(
      "/kundli/generate",
      payload ?? {},
    );
    return (res as any).kundli as KundliData;
  }

  async saveBirthDetails(payload: SaveBirthDetailsPayload): Promise<void> {
    await apiClient.post("/kundli/birth-details", payload);
  }

  async updateVisibility(isPublic: boolean): Promise<{
    isPublic: boolean;
    shareToken: string | null;
    shareUrl: string | null;
  }> {
    const res = await apiClient.patch<any>("/kundli/visibility", { isPublic });
    return res as any;
  }

  async getPublicKundli(shareToken: string): Promise<KundliData | null> {
    try {
      const res = await apiClient.get<{ kundli: KundliData }>(
        `/kundli/share/${shareToken}`,
      );
      return (res as any).kundli ?? null;
    } catch {
      return null;
    }
  }
}

export const kundliService = new KundliService();
