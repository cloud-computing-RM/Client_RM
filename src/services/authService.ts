// ===================================
// 인증 관련 API 서비스
// ===================================

import { post, get } from './apiClient';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
} from '../types';

/**
 * 회원가입
 * POST /api/auth/register
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await post<ApiResponse<AuthResponse>>(
    '/api/auth/register',
    data
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '회원가입에 실패했습니다.');
  }

  return response.data;
}

/**
 * 로그인
 * POST /api/auth/login
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await post<ApiResponse<AuthResponse>>(
    '/api/auth/login',
    data
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '로그인에 실패했습니다.');
  }

  return response.data;
}

/**
 * 내 정보 조회 (인증 필요)
 * GET /api/auth/me
 */
export async function getMe(): Promise<User> {
  const response = await get<ApiResponse<User>>('/api/auth/me');

  if (!response.success || !response.data) {
    throw new Error(response.message || '사용자 정보를 가져올 수 없습니다.');
  }

  return response.data;
}
