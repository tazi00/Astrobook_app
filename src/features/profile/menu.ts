import type { ProfileMenuItem } from "./components/ProfileMenu";

const SUPPORT: ProfileMenuItem[] = [
  { icon: "help-circle", label: "Help & Support", route: "/(user)/help-support" },
  { icon: "shield", label: "Privacy & Security", route: "/(user)/privacy-security" },
  { icon: "file-text", label: "Terms & Privacy Policy", route: "/(user)/legal" },
];

// Notifications yahan nahi — header ke bell se khulta hai.
export const USER_MENU: ProfileMenuItem[] = [
  { icon: "calendar", label: "My Bookings", route: "/(user)/my-bookings" },
  ...SUPPORT,
];

export const ASTROLOGER_MENU: ProfileMenuItem[] = SUPPORT;
