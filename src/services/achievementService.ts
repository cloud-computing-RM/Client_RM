// ===================================
// 업적(Achievements) 관련 API 서비스
// ===================================

import { get, post } from './apiClient';

/**
 * 업적 타입
 */
export interface Achievement {
  achievement_id: number;
  name: string;
  description: string;
  icon?: string;
  condition_type: string; // 예: 'run_distance', 'run_count', 'match_count' 등
  condition_value: number;
  reward_points?: number;
  created_at?: string;
}

/**
 * 사용자 업적 타입
 */
export interface UserAchievement {
  user_achievement_id: number;
  user_id: number;
  achievement_id: number;
  achieved_at: string;
  achievement?: Achievement;
}

/**
 * 업적 체크 응답
 */
export interface AchievementCheckResponse {
  newAchievements: Achievement[];
  totalPoints: number;
}

/**
 * 모든 업적 목록 조회
 * GET /api/achievements
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  const response = await get<any>('/api/achievements');

  console.log('모든 업적 목록 조회 응답:', response);

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

  throw new Error(response.message || '업적 목록을 가져올 수 없습니다.');
}

/**
 * 특정 사용자의 업적 조회
 * GET /api/achievements/users/{user_id}
 */
export async function getUserAchievements(userId: number): Promise<UserAchievement[]> {
  const response = await get<any>(`/api/achievements/users/${userId}`);

  console.log('사용자 업적 조회 응답:', response);

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

  throw new Error(response.message || '사용자 업적을 가져올 수 없습니다.');
}

/**
 * 업적 조건 체크 및 자동 부여
 * POST /api/achievements/check
 */
export async function checkAchievements(): Promise<AchievementCheckResponse> {
  const response = await post<any>('/api/achievements/check', {});

  console.log('업적 체크 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { newAchievements: [...], totalPoints: 0 } }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { newAchievements: [...], totalPoints: 0 }
  if (response.newAchievements !== undefined && response.totalPoints !== undefined) {
    return response;
  }

  // 3. { data: { newAchievements: [...], totalPoints: 0 } }
  if (response.data?.newAchievements && response.data?.totalPoints !== undefined) {
    return response.data;
  }

  throw new Error(response.message || '업적 체크에 실패했습니다.');
}
