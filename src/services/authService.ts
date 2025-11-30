// ===================================
// 인증 관련 API 서비스
// ===================================

import { post } from './apiClient';
import { tokenStorage } from './apiClient';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  User,
} from '../types';

/**
 * 로그인
 * POST /api/auth/login
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await post<any>('/api/auth/login', data);

  console.log('로그인 응답:', response);

  // 다양한 응답 형식 처리
  let authData: AuthResponse | null = null;

  // 1. { success: true, data: { user: {...}, token: "..." } }
  if (response.success && response.data) {
    authData = response.data;
  }
  // 2. { user: {...}, token: "..." }
  else if (response.user && response.token) {
    authData = response;
  }
  // 3. { data: { user: {...}, token: "..." } }
  else if (response.data?.user && response.data?.token) {
    authData = response.data;
  }

  if (!authData || !authData.token || !authData.user) {
    throw new Error(response.message || '로그인에 실패했습니다.');
  }

  // 토큰과 사용자 정보를 localStorage에 저장
  tokenStorage.set(authData.token);
  localStorage.setItem('runmate_user', JSON.stringify(authData.user));
  localStorage.setItem('runmate_auth', 'true');

  console.log('로그인 성공 - 토큰 저장됨:', authData.token.substring(0, 20) + '...');

  return authData;
}

/**
 * 회원가입
 * POST /api/auth/register
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await post<any>('/api/auth/register', data);

  console.log('회원가입 응답:', response);

  // 다양한 응답 형식 처리
  let authData: AuthResponse | null = null;

  // 1. { success: true, data: { user: {...}, token: "..." } }
  if (response.success && response.data) {
    authData = response.data;
  }
  // 2. { user: {...}, token: "..." }
  else if (response.user && response.token) {
    authData = response;
  }
  // 3. { data: { user: {...}, token: "..." } }
  else if (response.data?.user && response.data?.token) {
    authData = response.data;
  }

  if (!authData || !authData.token || !authData.user) {
    throw new Error(response.message || '회원가입에 실패했습니다.');
  }

  // 토큰과 사용자 정보를 localStorage에 저장
  tokenStorage.set(authData.token);
  localStorage.setItem('runmate_user', JSON.stringify(authData.user));
  localStorage.setItem('runmate_auth', 'true');

  console.log('회원가입 성공 - 토큰 저장됨:', authData.token.substring(0, 20) + '...');

  return authData;
}

/**
 * 로그아웃
 */
export function logout(): void {
  tokenStorage.remove();
  localStorage.removeItem('runmate_user');
  localStorage.removeItem('runmate_auth');
  console.log('로그아웃 완료');
}

/**
 * 현재 로그인 상태 확인
 */
export function isAuthenticated(): boolean {
  const token = tokenStorage.get();
  const auth = localStorage.getItem('runmate_auth');
  return !!(token && auth === 'true');
}

/**
 * 현재 사용자 정보 가져오기
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('runmate_user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('사용자 정보 파싱 실패:', error);
    return null;
  }
}
