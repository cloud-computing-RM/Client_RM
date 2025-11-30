// ===================================
// 게시글 관련 API 서비스
// ===================================

import { get, post, put, del, uploadFile } from './apiClient';
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

  const response = await get<any>(
    `/api/posts?${params.toString()}`
  );

  console.log('게시글 목록 조회 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { posts: [...], total: N, has_more: boolean } }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { posts: [...], total: N, has_more: boolean }
  if (response.posts) {
    return response;
  }

  // 3. { data: { posts: [...], total: N } }
  if (response.data?.posts) {
    return response.data;
  }

  throw new Error(response.message || '게시글 목록을 가져올 수 없습니다.');
}

/**
 * 게시글 상세 조회
 * GET /api/posts/{id}
 */
export async function getPost(postId: number): Promise<Post> {
  const response = await get<any>(`/api/posts/${postId}`);

  console.log('게시글 상세 조회 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { post_id: ..., ... } }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { post_id: ..., ... } (Post 객체 직접 반환)
  if (response.post_id) {
    return response;
  }

  // 3. { data: { post_id: ..., ... } }
  if (response.data?.post_id) {
    return response.data;
  }

  throw new Error(response.message || '게시글을 가져올 수 없습니다.');
}

/**
 * 게시글 작성
 * POST /api/posts
 */
export async function createPost(data: PostCreateRequest): Promise<Post> {
  const response = await post<any>('/api/posts', data);

  console.log('게시글 작성 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { post_id: ..., ... } }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { post_id: ..., ... } (Post 객체 직접 반환)
  if (response.post_id) {
    return response;
  }

  // 3. { data: { post_id: ..., ... } }
  if (response.data?.post_id) {
    return response.data;
  }

  throw new Error(response.message || '게시글 작성에 실패했습니다.');
}

/**
 * 게시글 수정
 * PUT /api/posts/{id}
 */
export async function updatePost(postId: number, data: PostUpdateRequest): Promise<Post> {
  const response = await put<any>(`/api/posts/${postId}`, data);

  console.log('게시글 수정 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { post_id: ..., ... } }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { post_id: ..., ... } (Post 객체 직접 반환)
  if (response.post_id) {
    return response;
  }

  // 3. { data: { post_id: ..., ... } }
  if (response.data?.post_id) {
    return response.data;
  }

  throw new Error(response.message || '게시글 수정에 실패했습니다.');
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
  const response = await get<any>(`/api/posts/${postId}/comments`);

  console.log('댓글 목록 조회 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: [...] }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. [...] (배열 직접 반환)
  if (Array.isArray(response)) {
    return response;
  }

  // 3. { data: [...] }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }

  throw new Error(response.message || '댓글 목록을 가져올 수 없습니다.');
}

/**
 * 댓글 작성
 * POST /api/posts/{id}/comments
 */
export async function createComment(postId: number, data: CommentCreateRequest): Promise<Comment> {
  const response = await post<any>(`/api/posts/${postId}/comments`, data);

  console.log('댓글 작성 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { comment_id: ..., ... } }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { comment_id: ..., ... } (Comment 객체 직접 반환)
  if (response.comment_id) {
    return response;
  }

  // 3. { data: { comment_id: ..., ... } }
  if (response.data?.comment_id) {
    return response.data;
  }

  throw new Error(response.message || '댓글 작성에 실패했습니다.');
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

/**
 * 이미지 업로드
 * POST /api/upload
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await uploadFile<any>(
    '/api/upload',
    formData
  );

  console.log('이미지 업로드 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { imageUrl: "..." } }
  if (response.success && response.data?.imageUrl) {
    return response.data.imageUrl;
  }

  // 2. { imageUrl: "..." }
  if (response.imageUrl) {
    return response.imageUrl;
  }

  // 3. { success: true, imageUrl: "..." }
  if (response.success && response.imageUrl) {
    return response.imageUrl;
  }

  // 4. { data: { imageUrl: "..." } }
  if (response.data?.imageUrl) {
    return response.data.imageUrl;
  }

  throw new Error(response.message || '이미지 업로드에 실패했습니다.');
}
