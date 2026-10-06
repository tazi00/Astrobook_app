// ─── Payment failure classification ─────────────────────────────────────────
// Ek hi jagah jahan decide hota hai ki payment kyun fail hua aur user ko kya
// dikhana hai. Checkout (single booking) aur Cart (multi) dono yehi use karte
// hain; payment-failed screen sirf `kind` leke copy dikhati hai.

export type PaymentStage = "booking" | "order" | "gateway" | "verify";

export type PaymentFailureKind =
  | "cancelled" // user ne Razorpay modal band kar diya
  | "declined" // bank/UPI ne authenticate/approve nahi kiya
  | "network" // internet / timeout
  | "slot_taken" // slot kisi aur ne le liya
  | "server" // hamari taraf ki dikkat (backend / gateway keys)
  | "verify" // paisa gateway tak gaya, confirm karna fail hua
  | "unknown";

export type PaymentFailureCopy = {
  kind: PaymentFailureKind;
  icon: "x-circle" | "slash" | "wifi-off" | "clock" | "tool" | "alert-triangle" | "help-circle";
  tone: "neutral" | "danger" | "warning";
  title: string;
  message: string;
  // Chhote "ab kya karun" points
  tips: string[];
  /** Kya is case mein "Dobara try" dikhana theek hai */
  canRetry: boolean;
  /** Retry ki jagah slot badalna hai */
  changeSlot: boolean;
  /** Booking cancel karni hai ya nahi (verify fail mein NAHI — paisa kat chuka ho sakta hai) */
  cancelBooking: boolean;
};

const COPY: Record<PaymentFailureKind, Omit<PaymentFailureCopy, "kind">> = {
  cancelled: {
    icon: "slash",
    tone: "neutral",
    title: "Payment cancel kar diya",
    message: "Tumne payment beech mein band kar diya, isliye koi paisa nahi kata.",
    tips: ["Slot abhi bhi khali ho sakta hai — dobara try kar sakte ho."],
    canRetry: true,
    changeSlot: false,
    cancelBooking: true,
  },
  declined: {
    icon: "x-circle",
    tone: "danger",
    title: "Bank ne payment approve nahi kiya",
    message:
      "OTP/PIN galat tha, time out ho gaya, ya bank ne transaction rok diya.",
    tips: [
      "Doosra UPI/card ya payment method try karo.",
      "Agar paisa kat gaya ho to 5–7 din mein apne aap wapas aa jaata hai.",
    ],
    canRetry: true,
    changeSlot: false,
    cancelBooking: true,
  },
  network: {
    icon: "wifi-off",
    tone: "warning",
    title: "Internet connection problem",
    message: "Network ki wajah se payment poora nahi ho paya.",
    tips: [
      "Wi-Fi/mobile data check karke dobara try karo.",
      "Agar paisa kat gaya ho to My Bookings mein status dekh lo.",
    ],
    canRetry: true,
    changeSlot: false,
    cancelBooking: true,
  },
  slot_taken: {
    icon: "clock",
    tone: "warning",
    title: "Yeh slot ab available nahi hai",
    message: "Kisi aur ne yeh time abhi book kar liya. Tumhara koi paisa nahi kata.",
    tips: ["Doosra time slot chuno — poora process 1 minute ka hai."],
    canRetry: false,
    changeSlot: true,
    cancelBooking: true,
  },
  server: {
    icon: "tool",
    tone: "warning",
    title: "Humari taraf se dikkat aa gayi",
    message:
      "Yeh tumhari galti nahi hai — payment system abhi theek se kaam nahi kar raha. Tumhara koi paisa nahi kata.",
    tips: ["Thodi der baad dobara try karo.", "Baar-baar aaye to Support se baat karo."],
    canRetry: true,
    changeSlot: false,
    cancelBooking: true,
  },
  verify: {
    icon: "alert-triangle",
    tone: "warning",
    title: "Payment confirm ho raha hai",
    message:
      "Tumhara payment gateway tak pahunch gaya, par hum use abhi confirm nahi kar paye.",
    tips: [
      "Dobara payment mat karo — double charge ho sakta hai.",
      "My Bookings mein kuch minute baad status dekho.",
      "Booking confirm na ho aur paisa kata ho to Support se contact karo — hum check karke turant help karenge.",
    ],
    canRetry: false,
    changeSlot: false,
    cancelBooking: false,
  },
  unknown: {
    icon: "help-circle",
    tone: "danger",
    title: "Payment complete nahi ho paya",
    message: "Kuch gadbad ho gayi. Tumhara paisa nahi kata hoga.",
    tips: ["Dobara try karo.", "Phir bhi na ho to Support ko batao."],
    canRetry: true,
    changeSlot: false,
    cancelBooking: true,
  },
};

export function copyForKind(kind: PaymentFailureKind): PaymentFailureCopy {
  return { kind, ...COPY[kind] };
}

export function isPaymentFailureKind(v: unknown): v is PaymentFailureKind {
  return typeof v === "string" && v in COPY;
}

// Razorpay RN SDK errors alag-alag shape mein aate hain:
//   { code: 2, description: "Payment Cancelled" }                     (Android/iOS)
//   { error: { code, description, reason, step, source } }           (nested)
// Isliye dono shapes padhte hain.
function razorpayParts(err: any) {
  const inner = err?.error && typeof err.error === "object" ? err.error : err;
  return {
    code: inner?.code ?? err?.code,
    description: String(inner?.description ?? err?.description ?? ""),
    reason: String(inner?.reason ?? ""),
    step: String(inner?.step ?? ""),
    source: String(inner?.source ?? ""),
  };
}

export function classifyPaymentFailure(
  err: any,
  stage: PaymentStage,
): PaymentFailureKind {
  const status: number | undefined = err?.response?.status;
  const apiMsg = String(err?.response?.data?.message ?? "").toLowerCase();

  // 1. Payment gateway ke baad confirm karte waqt dikkat
  if (stage === "verify") return "verify";

  // 2. Razorpay modal se aaye errors
  if (stage === "gateway") {
    const r = razorpayParts(err);
    const text = `${r.description} ${r.reason}`.toLowerCase();
    if (
      r.code === 2 ||
      text.includes("cancel") ||
      r.reason === "payment_cancelled" ||
      r.step === "payment_cancelled"
    ) {
      return "cancelled";
    }
    if (r.code === 0 || text.includes("network") || text.includes("internet")) {
      return "network";
    }
    if (
      r.code === 1 ||
      r.code === 3 ||
      r.code === 4 ||
      r.code === "SERVER_ERROR" ||
      r.code === "GATEWAY_ERROR"
    ) {
      return "server";
    }
    // "Error in opening checkout" — checkout modal khula hi nahi, ye bank side
    // nahi hai. Ye tab hota hai jab order test key se bana ho par app live key
    // use kar raha ho (ya vice versa). Humari taraf ki dikkat hai.
    if (
      r.code === "BAD_REQUEST_ERROR" &&
      (text.includes("opening checkout") || text.includes("open checkout"))
    ) {
      return "server";
    }
    // BAD_REQUEST_ERROR / payment_failed / authentication step = bank side
    return "declined";
  }

  // 3. Hamari API calls (booking / order)
  if (!err?.response && (err?.request || err?.code === "ERR_NETWORK" || err?.code === "ECONNABORTED")) {
    return "network";
  }
  if (
    status === 409 ||
    apiMsg.includes("already booked") ||
    apiMsg.includes("slot") ||
    apiMsg.includes("not available")
  ) {
    return "slot_taken";
  }
  if (status && status >= 500) return "server";
  return "unknown";
}