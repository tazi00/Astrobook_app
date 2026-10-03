import { apiClient } from "@/services/apiClient";
import type {
  Comment,
  CreatePostPayload,
  ImageKitAuthToken,
  UpdatePostPayload,
  Post,
} from "../types/post.types";

class PostsService {
  private readonly base = "/posts";

  async getAll(
    limit = 20,
    offset = 0,
  ): Promise<{ posts: Post[]; hasMore: boolean }> {
    const res = await apiClient.get<{ posts: Post[]; hasMore: boolean }>(
      this.base,
      { params: { limit, offset } },
    );
    return res.data;
  }

  async getByAstrologer(astrologerId: string): Promise<Post[]> {
    const res = await apiClient.get<{ posts: Post[] }>(this.base, {
      params: { astrologerId },
    });
    return res.data.posts;
  }

  async getByTag(
    tag: string,
    limit = 20,
    offset = 0,
  ): Promise<{ posts: Post[]; hasMore: boolean }> {
    const res = await apiClient.get<{ posts: Post[]; hasMore: boolean }>(
      this.base,
      { params: { tag, limit, offset } },
    );
    return res.data;
  }

  async getById(id: string): Promise<Post> {
    const res = await apiClient.get<{ post: Post }>(`${this.base}/${id}`);
    return res.data.post;
  }

  async getMyPosts(limit = 12, offset = 0): Promise<Post[]> {
    const res = await apiClient.get<{ posts: Post[] }>(`${this.base}/my`, {
      params: { limit, offset },
    });
    return res.data.posts;
  }

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const res = await apiClient.post<{ post: Post }>(this.base, payload);
    return res.data.post;
  }

  async updatePost(id: string, payload: UpdatePostPayload): Promise<Post> {
    const res = await apiClient.patch<{ post: Post }>(`${this.base}/${id}`, payload);
    return res.data.post;
  }

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`${this.base}/${id}`);
  }

  async getImageKitToken(): Promise<ImageKitAuthToken> {
    const res = await apiClient.get<ImageKitAuthToken>(
      `${this.base}/upload-token`,
    );
    return res.data;
  }

  async likePost(id: string): Promise<void> {
    await apiClient.post(`${this.base}/${id}/like`);
  }

  async unlikePost(id: string): Promise<void> {
    await apiClient.delete(`${this.base}/${id}/like`);
  }

  // Is category/astrologer ke aur posts (backend: tags overlap, phir same astrologer)
  async getRelated(id: string, limit = 3): Promise<Post[]> {
    const res = await apiClient.get<{ posts: Post[] }>(
      `${this.base}/${id}/related`,
      { params: { limit } },
    );
    return res.data.posts;
  }

  // Newest first, offset-paginated
  async getComments(id: string, limit = 20, offset = 0): Promise<Comment[]> {
    const res = await apiClient.get<{ comments: Comment[] }>(
      `${this.base}/${id}/comments`,
      { params: { limit, offset } },
    );
    return res.data.comments;
  }

  async addComment(id: string, content: string): Promise<Comment> {
    const res = await apiClient.post<{ comment: Comment }>(
      `${this.base}/${id}/comments`,
      { content },
    );
    return res.data.comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`${this.base}/comments/${commentId}`);
  }
}

export const postsService = new PostsService();
