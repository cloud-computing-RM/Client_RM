// ===================================
// 사용자 프로필 관련 API 서비스
// ===================================

import { put, patch, get } from './apiClient';
import type {
  User,
  ProfileUpdateRequest,
  LocationUpdate,
  PreferencesUpdate,
  NearbyUser,
  ApiResponse,
} from '../types';

/**
 * 프로필 전체 정보 수정
 * PUT /api/users/profile
 */
export async function updateProfile(
  data: ProfileUpdateRequest
): Promise<User> {
  const response = await put<ApiResponse<User>>('/api/users/profile', data);

  if (!response.success || !response.data) {
    throw new Error(response.message || '프로필 수정에 실패했습니다.');
  }

  return response.data;
}

/**
 * 프로필 사진 변경
 * PATCH /api/users/profile-image
 */
export async function updateProfileImage(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await patch<ApiResponse<User>>(
    '/api/users/profile-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '프로필 사진 변경에 실패했습니다.');
  }

  return response.data;
}

/**
 * 러닝 선호도 수정
 * PATCH /api/users/preferences
 */
export async function updatePreferences(
  preferences: PreferencesUpdate
): Promise<User> {
  const response = await patch<ApiResponse<User>>(
    '/api/users/preferences',
    preferences
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '선호도 수정에 실패했습니다.');
  }

  return response.data;
}

/**
 * GPS 위치 업데이트
 * PATCH /api/users/location
 */
export async function updateLocation(location: LocationUpdate): Promise<User> {
  const response = await patch<ApiResponse<User>>(
    '/api/users/location',
    location
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || 'GPS 위치 업데이트에 실패했습니다.');
  }

  return response.data;
}

/**
 * GPS 기반 주변 러너 검색
 * GET /api/users/nearby?latitude={lat}&longitude={lng}&radius={radius}
 */
export async function getNearbyUsers(
  latitude: number,
  longitude: number,
  radius?: number
): Promise<NearbyUser[]> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });

  if (radius) {
    params.append('radius', radius.toString());
  }

  const response = await get<ApiResponse<NearbyUser[]>>(
    `/api/users/nearby?${params.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '주변 러너 검색에 실패했습니다.');
  }

  return response.data;
}

/**
 * 다른 사용자 프로필 조회
 * GET /api/users/{user_id}
 */
export async function getUserProfile(userId: number): Promise<User> {
  const response = await get<ApiResponse<User>>(`/api/users/${userId}`);

  if (!response.success || !response.data) {
    throw new Error(response.message || '사용자 정보를 가져올 수 없습니다.');
  }

  return response.data;
}

