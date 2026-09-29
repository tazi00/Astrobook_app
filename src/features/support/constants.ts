// Help & Support ka saara content ek jagah — screen mein hardcode nahi.

// TODO(launch se pehle bharna): support ka asli WhatsApp number aur email.
// Khaali chhodne pe screen mein woh button dikhega hi nahi.
export const SUPPORT_CONTACT = {
  // Country code ke saath, bina + ya space ke. Example: "919876543210"
  whatsappNumber: "",
  email: "",
  // Support kab available hai — user ko expectation set karne ke liye
  hours: "Roz subah 10 baje se raat 8 baje tak",
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

// Refund wali line backend ke rule se match karti hai
// (booking.service.ts → USER_CANCEL_REFUND_WINDOW_MS = 48 ghante).
// Us rule ko badlo to yeh FAQ bhi badalna mat bhoolna.
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "join",
    question: "Session kaise join karun?",
    answer:
      "Profile → My Bookings mein apni booking kholo aur session ke time pe Join button dabao. Session shuru hone ke time se pehle join nahi ho sakta, isliye time pe aana.",
  },
  {
    id: "cancel-refund",
    question: "Booking cancel karne pe refund milega?",
    answer:
      "Session se kam se kam 48 ghante pehle cancel karoge to poora refund milega. Isse kam time mein cancel karne, ya session miss karne pe refund nahi milta. Agar astrologer khud cancel kare to hamesha poora refund milta hai.",
  },
  {
    id: "payment-no-booking",
    question: "Payment ho gaya par booking confirm nahi dikh rahi",
    answer:
      "Kuch der wait karo aur My Bookings ko neeche kheench kar refresh karo. Confirmation kabhi kabhi thodi der se aati hai. 10-15 minute baad bhi booking na dikhe to humein payment ka screenshot bhejo.",
  },
  {
    id: "payment-failed",
    question: "Payment fail hua par paise kat gaye",
    answer:
      "Aisa hone pe bank aam taur par kuch working days mein paise apne aap wapas kar deta hai. Uske baad bhi paise na aayein to humein transaction ID ke saath contact karo.",
  },
  {
    id: "call-issue",
    question: "Session mein audio ya video nahi chal raha",
    answer:
      "Check karo ki app ko camera aur microphone ki permission mili hai aur internet theek chal raha hai. Phir bhi dikkat ho to session se bahar aake dobara join karo, ya app band karke phir kholo.",
  },
  {
    id: "become-astrologer",
    question: "Main astrologer kaise ban sakta hun?",
    answer:
      "Profile screen pe Upgrade to Astrologer dabao aur form bharo. Hamari team details verify karti hai, aur approve hote hi tumhe notification milega.",
  },
];
