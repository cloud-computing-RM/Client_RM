import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '../types';

// ===================================
// 환경 변수 또는 기본 URL 설정
// ===================================
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ===================================
// Axios 인스턴스 생성
// ===================================
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================================
// JWT 토큰 관리 유틸리티
// ===================================
export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem('runmate_token');
  },
  set: (token: string): void => {
    localStorage.setItem('runmate_token', token);
  },
  remove: (): void => {
    localStorage.removeItem('runmate_token');
  },
};

// ===================================
// Request 인터셉터 (토큰 자동 첨부)
// ===================================
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===================================
// Response 인터셉터 (에러 핸들링)
// ===================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // 네트워크 에러
    if (!error.response) {
      const networkError: ApiError = {
        message: '네트워크 연결을 확인해주세요.',
        status: 0,
      };
      return Promise.reject(networkError);
    }

    // 401 Unauthorized - 토큰 만료 또는 인증 실패
    if (error.response.status === 401) {
      tokenStorage.remove();
      localStorage.removeItem('runmate_user');
      localStorage.removeItem('runmate_auth');

      // 로그인 페이지로 리다이렉트 (선택사항)
      // window.location.href = '/';
    }

    // 서버 에러 메시지 추출
    const apiError: ApiError = {
      message: error.response.data?.message || error.response.data?.error || '오류가 발생했습니다.',
      status: error.response.status,
    };

    return Promise.reject(apiError);
  }
);

// ===================================
// HTTP 메서드 래퍼 함수
// ===================================

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function put<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function patch<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

// ===================================
// 파일 업로드 전용 함수
// ===================================
export async function uploadFile<T>(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export default apiClient;

