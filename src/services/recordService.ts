import { get, post, put, del } from './apiClient';
import type {
  RunningRecord,
  RunningRecordCreateRequest,
  RunningRecordUpdateRequest,
  RunningRecordsListResponse,
  ApiResponse,
} from '../types';

// ===================================
// Running Records API Service
// ===================================

/**
 * 러닝 기록 생성
 * POST /api/running-records
 */
export async function createRecord(
  data: RunningRecordCreateRequest
): Promise<RunningRecord> {
  const response = await post<ApiResponse<RunningRecord>>(
    '/api/running-records',
    data
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '기록 생성에 실패했습니다.');
  }

  return response.data;
}

/**
 * 러닝 기록 목록 조회
 * GET /api/running-records
 */
export async function getRecords(params?: {
  limit?: number;
  offset?: number;
  sort?: string;
}): Promise<RunningRecordsListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.sort) queryParams.append('sort', params.sort);

  const url = `/api/running-records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await get<ApiResponse<RunningRecordsListResponse>>(url);

  if (!response.success || !response.data) {
    throw new Error(response.message || '기록 조회에 실패했습니다.');
  }

  return response.data;
}

/**
 * 특정 러닝 기록 조회
 * GET /api/running-records/:id
 */
export async function getRecord(id: number): Promise<RunningRecord> {
  const response = await get<ApiResponse<RunningRecord>>(
    `/api/running-records/${id}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '기록 조회에 실패했습니다.');
  }

  return response.data;
}

/**
 * 러닝 기록 수정
 * PUT /api/running-records/:id
 */
export async function updateRecord(
  id: number,
  data: RunningRecordUpdateRequest
): Promise<RunningRecord> {
  const response = await put<ApiResponse<RunningRecord>>(
    `/api/running-records/${id}`,
    data
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '기록 수정에 실패했습니다.');
  }

  return response.data;
}

/**
 * 러닝 기록 삭제
 * DELETE /api/running-records/:id
 */
export async function deleteRecord(id: number): Promise<void> {
  const response = await del<ApiResponse<void>>(
    `/api/running-records/${id}`
  );

  if (!response.success) {
    throw new Error(response.message || '기록 삭제에 실패했습니다.');
  }
}

/**
 * 러닝 통계 조회
 * GET /api/running-records/stats/summary
 */
export interface RunningStats {
  total_runs: number;
  total_distance: number;
  total_duration: string;
  average_pace: string;
  best_pace?: string;
}

export async function getRunningStats(month?: string): Promise<RunningStats> {
  const queryParams = month ? `?month=${month}` : '';
  const response = await get<ApiResponse<RunningStats>>(
    `/api/running-records/stats/summary${queryParams}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || '통계 조회에 실패했습니다.');
  }

  return response.data;
}
