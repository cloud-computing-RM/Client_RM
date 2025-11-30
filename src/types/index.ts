// ===================================
// API 응답 공통 타입
// ===================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ===================================
// User 관련 타입
// ===================================

export interface User {
  user_id: number;
  email: string;
  name: string;
  age: number;
  gender?: string | null;
  location: string;
  bio?: string | null;
  profile_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  preferred_pace_min?: number | null;
  preferred_pace_max?: number | null;
  preferred_distance_min?: number | null;
  preferred_distance_max?: number | null;
  preferred_time?: string | null;
  preferred_frequency?: string | null;
  created_at?: string;
  updated_at?: string;
  tags?: Tag[];
}

// ===================================
// Auth 관련 타입
// ===================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  age: number;
  gender?: string;
  location: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ===================================
// Profile 관련 타입
// ===================================

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string;
  age?: number;
  location?: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
}

export interface PreferencesUpdate {
  preferred_pace_min?: number;
  preferred_pace_max?: number;
  preferred_distance_min?: number;
  preferred_distance_max?: number;
  preferred_time?: string;
  preferred_frequency?: string;
}

// ===================================
// Tag 관련 타입
// ===================================

export interface Tag {
  tag_id: number;
  tag_name: string;
  category: string; // "time", "level", "purpose", "social", "environment", "interest"
  created_at?: string;
}

export interface UserTag {
  user_id: number;
  tag_id: number;
  created_at?: string;
}

// ===================================
// Running Record 관련 타입
// ===================================

export interface RunningRecord {
  record_id: number;
  user_id: number;
  date: string; // ISO 8601 format
  distance: number; // km
  duration: string; // "HH:MM:SS" format
  pace: string; // "MM:SS/km" format
  location: string;
  feeling: 'great' | 'good' | 'normal' | 'tired';
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RunningRecordCreateRequest {
  date: string;
  distance: number;
  duration: string;
  pace: string;
  location: string;
  feeling: 'great' | 'good' | 'normal' | 'tired';
  notes?: string;
}

export interface RunningRecordUpdateRequest {
  date?: string;
  distance?: number;
  duration?: string;
  pace?: string;
  location?: string;
  feeling?: 'great' | 'good' | 'normal' | 'tired';
  notes?: string;
}

export interface RunningRecordsListResponse {
  records: RunningRecord[];
  total: number;
  has_more: boolean;
}

// ===================================
// 주변 사용자 관련 타입
// ===================================

export interface NearbyUser extends User {
  distance?: number; // km
  tags?: Tag[];
}

// ===================================
// Error 관련 타입
// ===================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

