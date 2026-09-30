// Backend reviews module (modules/reviews/schemas) ke saath sync

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { name: string; avatarUrl: string | null };
};

export type ReviewSummary = {
  average: number;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type AstrologerReviewsPage = {
  summary: ReviewSummary;
  reviews: Review[];
};

/** Meri di hui review — my-bookings mein "Rate karo" vs "Aapki rating" */
export type MyReview = {
  id: string;
  appointmentId: string;
  astrologerId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SubmitReviewInput = {
  appointmentId: string;
  astrologerId: string;
  rating: number;
  comment?: string;
};
