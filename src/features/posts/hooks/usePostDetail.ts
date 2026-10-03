import { queryKeys } from "@/lib/queryClient";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postsService } from "../services/posts.service";
import type { Comment, Post } from "../types/post.types";

const COMMENTS_PAGE = 20;

// ─── Post detail ─────────────────────────────────────────────────────────────

export function usePostDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.byId(id ?? ""),
    queryFn: () => postsService.getById(id!),
    enabled: !!id,
  });
}

type FeedData = InfiniteData<{ posts: Post[]; hasMore: boolean }, number>;

/** Post detail + feed dono cache me ek saath badlo (like / comment count) */
export function usePostCache(id: string | undefined) {
  const qc = useQueryClient();
  const key = queryKeys.posts.byId(id ?? "");

  const patchFeed = (fn: (p: Post) => Post) => {
    if (!id) return;
    qc.setQueryData<FeedData>(queryKeys.posts.feed, (old) =>
      old
        ? {
            ...old,
            pages: old.pages.map((pg) => ({
              ...pg,
              posts: pg.posts.map((p) => (p.id === id ? fn(p) : p)),
            })),
          }
        : old,
    );
  };

  const setPost = (updated: Post) => {
    qc.setQueryData<Post>(key, updated);
    patchFeed(() => updated);
  };

  const bumpComments = (delta: number) => {
    const bump = (p: Post): Post => ({
      ...p,
      commentsCount: Math.max(0, p.commentsCount + delta),
    });
    qc.setQueryData<Post>(key, (p) => (p ? bump(p) : p));
    patchFeed(bump);
  };

  return { setPost, bumpComments };
}

// ─── Related posts (same category, max 3) ────────────────────────────────────

export function useRelatedPosts(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.related(id ?? ""),
    queryFn: () => postsService.getRelated(id!, 3),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

// ─── Comments (newest first, load-more) ──────────────────────────────────────

export function usePostComments(id: string | undefined, enabled: boolean) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.posts.comments(id ?? ""),
    queryFn: ({ pageParam }) =>
      postsService.getComments(id!, COMMENTS_PAGE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === COMMENTS_PAGE
        ? allPages.length * COMMENTS_PAGE
        : undefined,
    enabled: !!id && enabled,
  });

  // Offset pagination + naye comments ke beech duplicate ban sakta hai → id se dedupe
  const seen = new Set<string>();
  const comments: Comment[] = [];
  for (const page of query.data?.pages ?? []) {
    for (const c of page) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        comments.push(c);
      }
    }
  }

  return {
    comments,
    loading: query.isPending && enabled,
    error: query.isError,
    loadingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
    },
    refetch: query.refetch,
  };
}

export function useAddComment(postId: string | undefined) {
  const qc = useQueryClient();
  const { bumpComments } = usePostCache(postId);

  return useMutation({
    mutationFn: (content: string) => postsService.addComment(postId!, content.trim()),
    onSuccess: (comment) => {
      qc.setQueryData<InfiniteData<Comment[], number>>(
        queryKeys.posts.comments(postId ?? ""),
        (old) => {
          if (!old) return old;
          const [first = [], ...rest] = old.pages;
          return { ...old, pages: [[comment, ...first], ...rest] };
        },
      );
      bumpComments(1);
    },
  });
}

export function useDeleteComment(postId: string | undefined) {
  const qc = useQueryClient();
  const { bumpComments } = usePostCache(postId);

  return useMutation({
    mutationFn: (commentId: string) => postsService.deleteComment(commentId),
    onSuccess: (_data, commentId) => {
      qc.setQueryData<InfiniteData<Comment[], number>>(
        queryKeys.posts.comments(postId ?? ""),
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((pg) => pg.filter((c) => c.id !== commentId)),
              }
            : old,
      );
      bumpComments(-1);
    },
  });
}
