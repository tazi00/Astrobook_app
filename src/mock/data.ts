// ─────────────────────────────────────────
// ASTROBOOK — MOCK DATA
// Replace with real API calls later
// ─────────────────────────────────────────

export const MOCK_USER = {
  id: 'user_001',
  name: 'Tushar Dutta',
  phone: '+91 9876543210',
  email: 'tushar@inevelop.in',
  role: 'USER' as const,
};

export const MOCK_ASTROLOGER_USER = {
  id: 'astro_user_001',
  name: 'Suprio Karmakar',
  phone: '+91 9123456789',
  email: 'suprio@astrobook.in',
  role: 'ASTROLOGER' as const,
};

export const MOCK_ASTROLOGERS = [
  {
    id: 'astro_001',
    name: 'Suprio Karmakar',
    emoji: '🔮',
    speciality: 'Vedic Astrology',
    languages: 'Bengali, Hindi, English',
    experience: '12 years',
    rating: 4.8,
    reviews: 342,
    price: 499,
    online: true,
    bio: 'Expert in Vedic Astrology with 12+ years of experience. Specializes in birth chart analysis, career guidance, and relationship counseling.',
    interests: ['Kundli', 'Astrology'],
    color: '#6B21A8',
  },
  {
    id: 'astro_002',
    name: 'Ananya Sharma',
    emoji: '⭐',
    speciality: 'Tarot Reading',
    languages: 'Hindi, English',
    experience: '8 years',
    rating: 4.6,
    reviews: 218,
    price: 349,
    online: true,
    bio: 'Professional Tarot reader with deep understanding of Rider-Waite system. Helps with love, career, and life decisions.',
    interests: ['Tarot'],
    color: '#9D174D',
  },
  {
    id: 'astro_003',
    name: 'Rohit Verma',
    emoji: '🌙',
    speciality: 'Numerology',
    languages: 'Hindi, English',
    experience: '6 years',
    rating: 4.5,
    reviews: 156,
    price: 299,
    online: false,
    bio: 'Numerology expert specializing in name analysis, lucky numbers, and life path calculation.',
    interests: ['Numerology'],
    color: '#1E40AF',
  },
  {
    id: 'astro_004',
    name: 'Priya Nair',
    emoji: '☀️',
    speciality: 'Palmistry',
    languages: 'Malayalam, English, Hindi',
    experience: '10 years',
    rating: 4.7,
    reviews: 289,
    price: 399,
    online: true,
    bio: 'Palmistry expert with deep knowledge of hand analysis. Provides insights into health, wealth, and relationships.',
    interests: ['Palmistry'],
    color: '#065F46',
  },
  {
    id: 'astro_005',
    name: 'Vikash Joshi',
    emoji: '🪐',
    speciality: 'Vastu Shastra',
    languages: 'Hindi, English',
    experience: '15 years',
    rating: 4.9,
    reviews: 421,
    price: 599,
    online: false,
    bio: 'Senior Vastu consultant for homes and offices. Has helped 500+ families with Vastu corrections.',
    interests: ['Vastu'],
    color: '#92400E',
  },
];

export const MOCK_SERVICES = [
  {
    id: 'svc_001',
    astrologerId: 'astro_001',
    name: 'Birth Chart Analysis',
    description: 'Detailed analysis of your birth chart including planets, houses, and their effects on your life.',
    durationMins: 60,
    price: 499,
    callType: 'VIDEO' as const,
    isActive: true,
  },
  {
    id: 'svc_002',
    astrologerId: 'astro_001',
    name: 'Career Guidance',
    description: 'Career-focused astrology session to help you make the right professional decisions.',
    durationMins: 30,
    price: 299,
    callType: 'VOICE' as const,
    isActive: true,
  },
  {
    id: 'svc_003',
    astrologerId: 'astro_001',
    name: 'Relationship Compatibility',
    description: 'Kundli matching and relationship compatibility analysis for couples.',
    durationMins: 45,
    price: 399,
    callType: 'VIDEO' as const,
    isActive: true,
  },
  {
    id: 'svc_004',
    astrologerId: 'astro_002',
    name: 'Tarot Card Reading',
    description: 'Full tarot spread reading for clarity on life situations, relationships, and decisions.',
    durationMins: 30,
    price: 349,
    callType: 'VIDEO' as const,
    isActive: true,
  },
  {
    id: 'svc_005',
    astrologerId: 'astro_002',
    name: 'Monthly Forecast',
    description: 'Monthly tarot reading to prepare you for upcoming events and energies.',
    durationMins: 20,
    price: 199,
    callType: 'VOICE' as const,
    isActive: true,
  },
];

export const MOCK_SLOTS = [
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '12:30 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '04:30 PM', available: false },
];

export const MOCK_POSTS = [
  {
    id: 'post_001',
    astrologerId: 'astro_001',
    astrologerName: 'Suprio Karmakar',
    emoji: '🙏',
    bgColor: '#6B21A8',
    content: 'দুর্গতি নাশিনী\nইয়া দেবী সর্বভূতেষু, শক্তি রূপেণ সংস্থিতা!\nনমস্তে নমস্তে নমস্তে নমো নমঃ ॥',
    footer: 'মহালয়া শুভেচ্ছা',
    mediaType: null,
    mediaUrl: null,
    likes: 248,
    comments: 42,
    shares: 18,
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'post_002',
    astrologerId: 'astro_002',
    astrologerName: 'Ananya Sharma',
    emoji: '🌟',
    bgColor: '#1E3A5F',
    content: 'Mercury Retrograde ends today! Time to move forward with clarity and renewed purpose. ✨\n\nThis is the perfect time to:\n• Revisit old projects\n• Clear communication\n• Make important decisions',
    footer: 'Cosmic Update',
    mediaType: null,
    mediaUrl: null,
    likes: 156,
    comments: 28,
    shares: 12,
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: 'post_003',
    astrologerId: 'astro_003',
    astrologerName: 'Rohit Verma',
    emoji: '♈',
    bgColor: '#164E63',
    content: 'आज का राशिफल 🪐\nमेष राशि के जातकों के लिए आज का दिन विशेष शुभ है। नए कार्यों की शुरुआत के लिए उत्तम समय।',
    footer: 'Daily Horoscope',
    mediaType: null,
    mediaUrl: null,
    likes: 312,
    comments: 67,
    shares: 45,
    createdAt: '2025-11-01T06:00:00Z',
  },
];

export const MOCK_BOOKINGS = [
  {
    id: 'booking_001',
    userId: 'user_001',
    serviceId: 'svc_001',
    serviceName: 'Birth Chart Analysis',
    astrologerId: 'astro_001',
    astrologerName: 'Suprio Karmakar',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    durationMins: 60,
    price: 499,
    callType: 'VIDEO',
    status: 'CONFIRMED' as const,
    paymentStatus: 'PAID' as const,
  },
  {
    id: 'booking_002',
    userId: 'user_001',
    serviceId: 'svc_004',
    serviceName: 'Tarot Card Reading',
    astrologerId: 'astro_002',
    astrologerName: 'Ananya Sharma',
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    durationMins: 30,
    price: 349,
    callType: 'VIDEO',
    status: 'CONFIRMED' as const,
    paymentStatus: 'PAID' as const,
  },
  {
    id: 'booking_003',
    userId: 'user_001',
    serviceId: 'svc_002',
    serviceName: 'Career Guidance',
    astrologerId: 'astro_001',
    astrologerName: 'Suprio Karmakar',
    scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    durationMins: 30,
    price: 299,
    callType: 'VOICE',
    status: 'COMPLETED' as const,
    paymentStatus: 'PAID' as const,
  },
];

// Cart — stored locally, this is just the type
export type CartItem = {
  id: string;
  serviceId: string;
  serviceName: string;
  astrologerId: string;
  astrologerName: string;
  scheduledAt: string;
  durationMins: number;
  price: number;
  callType: 'VIDEO' | 'VOICE';
};

// Astrologer mock services (for astrologer panel)
export const MOCK_MY_SERVICES = MOCK_SERVICES.filter(s => s.astrologerId === 'astro_001');

export const MOCK_MY_BOOKINGS_AS_ASTROLOGER = MOCK_BOOKINGS.filter(b => b.astrologerId === 'astro_001');
