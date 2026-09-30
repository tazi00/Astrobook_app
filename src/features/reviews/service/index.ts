import { apiClient } from "@/services/apiClient";
import type {
  AstrologerReviewsPage,
  MyReview,
} from "../types";

class ReviewsServiceApi {
  async submit(
    appointmentId: string,
    rating: number,
    comment?: string,
  ): Promise<MyReview> {
    const res = await apiClient.post<{ review: MyReview }>(
      `/appointments/${appointmentId}/review`,
      { rating, comment: comment?.trim() || undefined },
    );
    return res.data.review;
  }

  async remove(appointmentId: string): Promise<void> {
    await apiClient.delete(`/appointments/${appointmentId}/review`);
  }

  async listMine(): Promise<MyReview[]> {
    const res = await apiClient.get<{ reviews: MyReview[] }>(
      "/reviews/mine",
    );
    return res.data.reviews;
  }

  async listForAstrologer(
    astrologerId: string,
    limit: number,
    offset: number,
  ): Promise<AstrologerReviewsPage> {
    const res = await apiClient.get<AstrologerReviewsPage>(
      `/astrologers/${astrologerId}/reviews?limit=${limit}&offset=${offset}`,
    );
    return res.data;
  }
}

export const reviewsService = new ReviewsServiceApi();
