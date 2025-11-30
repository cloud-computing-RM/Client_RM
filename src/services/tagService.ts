// ===================================
// 태그 관련 API 서비스
// ===================================

import { get, post, del } from './apiClient';
import type { Tag, ApiResponse } from '../types';

/**
 * 모든 태그 목록 조회
 * GET /api/tags
 */
export async function getAllTags(): Promise<Tag[]> {
  const response = await get<ApiResponse<Tag[]>>('/api/tags');

  if (!response.success || !response.data) {
    throw new Error(response.message || '태그 목록을 가져올 수 없습니다.');
  }

  return response.data;
}

/**
 * 내 프로필에 태그 추가
 * POST /api/tags/user
 */
export async function addUserTag(tagId: number): Promise<void> {
  const response = await post<ApiResponse<void>>('/api/tags/user', {
    tag_id: tagId,
  });

  if (!response.success) {
    throw new Error(response.message || '태그 추가에 실패했습니다.');
  }
}

/**
 * 내 프로필에서 태그 제거
 * DELETE /api/tags/user/{tag_id}
 */
export async function removeUserTag(tagId: number): Promise<void> {
  const response = await del<ApiResponse<void>>(`/api/tags/user/${tagId}`);

  if (!response.success) {
    throw new Error(response.message || '태그 제거에 실패했습니다.');
  }
}

/**
 * 특정 사용자의 태그 조회
 * GET /api/tags/user/{user_id}
 */
export async function getUserTags(userId: number): Promise<Tag[]> {
  const response = await get<ApiResponse<Tag[]>>(`/api/tags/user/${userId}`);

  if (!response.success || !response.data) {
    throw new Error(response.message || '사용자 태그를 가져올 수 없습니다.');
  }

  return response.data;
}

