// ===================================
// 좋아요 및 매칭 관련 API 서비스
// ===================================

import { get, post, del } from './apiClient';
import type { ApiResponse, User } from '../types';

/**
 * 좋아요 타입
 */
export interface Like {
  like_id: number;
  sender_id: number;
  receiver_id: number;
  created_at: string;
  sender?: User;
  receiver?: User;
}

/**
 * 매칭 타입
 */
export interface Match {
  match_id: number;
  user1_id: number;
  user2_id: number;
  created_at: string;
  user1?: User;
  user2?: User;
}

/**
 * 좋아요 보내기 (매칭 자동 감지)
 * POST /api/likes
 */
export async function sendLike(receiverId: number): Promise<{ like: Like; isMatch: boolean }> {
  const response = await post<any>('/api/likes', { receiver_id: receiverId });

  console.log('좋아요 보내기 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { like: {...}, isMatch: boolean } }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { like: {...}, isMatch: boolean }
  if (response.like !== undefined && response.isMatch !== undefined) {
    return response;
  }

  // 3. { data: { like: {...}, isMatch: boolean } }
  if (response.data?.like && response.data?.isMatch !== undefined) {
    return response.data;
  }

  throw new Error(response.message || '좋아요 보내기에 실패했습니다.');
}

/**
 * 보낸 좋아요 목록 조회
 * GET /api/likes/sent
 */
export async function getSentLikes(): Promise<Like[]> {
  const response = await get<any>('/api/likes/sent');

  console.log('보낸 좋아요 목록 조회 응답:', response);

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

  throw new Error(response.message || '보낸 좋아요 목록을 가져올 수 없습니다.');
}

/**
 * 받은 좋아요 목록 조회
 * GET /api/likes/received
 */
export async function getReceivedLikes(): Promise<Like[]> {
  const response = await get<any>('/api/likes/received');

  console.log('받은 좋아요 목록 조회 응답:', response);

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

  throw new Error(response.message || '받은 좋아요 목록을 가져올 수 없습니다.');
}

/**
 * 매칭된 사용자 목록 조회
 * GET /api/likes/matches
 */
export async function getMatches(): Promise<Match[]> {
  const response = await get<any>('/api/likes/matches');

  console.log('매칭 목록 조회 응답:', response);

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

  throw new Error(response.message || '매칭 목록을 가져올 수 없습니다.');
}

/**
 * 좋아요 취소
 * DELETE /api/likes/{like_id}
 */
export async function cancelLike(likeId: number): Promise<void> {
  const response = await del<any>(`/api/likes/${likeId}`);

  console.log('좋아요 취소 응답:', response);

  // 성공 여부 확인
  if (response.success === false) {
    throw new Error(response.message || '좋아요 취소에 실패했습니다.');
  }

  // 응답이 없거나 success가 없으면 성공으로 간주
}
