// ===================================
// 게시글 관련 API 서비스
// ===================================

import { get, post, put, del } from './apiClient';
import type {
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  PostListQuery,
  PostListResponse,
  Comment,
  CommentCreateRequest,
  ApiResponse,
} from '../types';

/**
 * 게시글 목록 조회
 * GET /api/posts
 */
export async function getPosts(query?: PostListQuery): Promise<PostListResponse> {
  const params = new URLSearchParams();

  if (query?.post_type) params.append('post_type', query.post_type);
  if (query?.search) params.append('search', query.search);
  if (query?.limit) params.append('limit', query.limit.toString());
  if (query?.offset) params.append('offset', query.offset.toString());
  if (query?.sort) params.append('sort', query.sort);

  const response = await get<ApiResponse<PostListResponse>>(
    `/api/posts?${params.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '게시글 목록을 가져올 수 없습니다.');
  }

  return response.data;
}

/**
 * 게시글 상세 조회
 * GET /api/posts/{id}
 */
export async function getPost(postId: number): Promise<Post> {
  const response = await get<ApiResponse<Post>>(`/api/posts/${postId}`);

  if (!response.success || !response.data) {
    throw new Error(response.message || '게시글을 가져올 수 없습니다.');
  }

  return response.data;
}

/**
 * 게시글 작성
 * POST /api/posts
 */
export async function createPost(data: PostCreateRequest): Promise<Post> {
  const response = await post<ApiResponse<Post>>('/api/posts', data);

  if (!response.success || !response.data) {
    throw new Error(response.message || '게시글 작성에 실패했습니다.');
  }

  return response.data;
}

/**
 * 게시글 수정
 * PUT /api/posts/{id}
 */
export async function updatePost(postId: number, data: PostUpdateRequest): Promise<Post> {
  const response = await put<ApiResponse<Post>>(`/api/posts/${postId}`, data);

  if (!response.success || !response.data) {
    throw new Error(response.message || '게시글 수정에 실패했습니다.');
  }

  return response.data;
}

/**
 * 게시글 삭제
 * DELETE /api/posts/{id}
 */
export async function deletePost(postId: number): Promise<void> {
  const response = await del<ApiResponse<any>>(`/api/posts/${postId}`);

  if (!response.success) {
    throw new Error(response.message || '게시글 삭제에 실패했습니다.');
  }
}

/**
 * 게시글 좋아요
 * POST /api/posts/{id}/like
 */
export async function likePost(postId: number): Promise<void> {
  const response = await post<ApiResponse<any>>(`/api/posts/${postId}/like`);

  if (!response.success) {
    throw new Error(response.message || '좋아요에 실패했습니다.');
  }
}

/**
 * 게시글 좋아요 취소
 * DELETE /api/posts/{id}/like
 */
export async function unlikePost(postId: number): Promise<void> {
  const response = await del<ApiResponse<any>>(`/api/posts/${postId}/like`);

  if (!response.success) {
    throw new Error(response.message || '좋아요 취소에 실패했습니다.');
  }
}

/**
 * 댓글 목록 조회
 * GET /api/posts/{id}/comments
 */
export async function getComments(postId: number): Promise<Comment[]> {
  const response = await get<ApiResponse<Comment[]>>(`/api/posts/${postId}/comments`);

  if (!response.success || !response.data) {
    throw new Error(response.message || '댓글 목록을 가져올 수 없습니다.');
  }

  return response.data;
}

/**
 * 댓글 작성
 * POST /api/posts/{id}/comments
 */
export async function createComment(postId: number, data: CommentCreateRequest): Promise<Comment> {
  const response = await post<ApiResponse<Comment>>(`/api/posts/${postId}/comments`, data);

  if (!response.success || !response.data) {
    throw new Error(response.message || '댓글 작성에 실패했습니다.');
  }

  return response.data;
}

/**
 * 댓글 삭제
 * DELETE /api/posts/comments/{comment_id}
 */
export async function deleteComment(commentId: number): Promise<void> {
  const response = await del<ApiResponse<any>>(`/api/posts/comments/${commentId}`);

  if (!response.success) {
    throw new Error(response.message || '댓글 삭제에 실패했습니다.');
  }
}
