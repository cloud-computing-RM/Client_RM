// ===================================
// 채팅 관련 API 서비스
// ===================================

import { get, post, del, uploadFile } from './apiClient';

/**
 * 메시지 타입
 */
export interface Message {
  message_id: number;
  chat_room_id: number;
  sender_id: number;
  message_text: string;
  message_type: "text" | "image" | "system";
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender: {
    user_id: number;
    name: string;
    profile_image: string | null;
  };
}

/**
 * 채팅방 사용자 타입
 */
export interface ChatRoomUser {
  chat_room_user_id: number;
  unread_count: number;
  last_read_at: string | null;
  joined_at: string;
  chat_room: {
    chat_room_id: number;
    room_type: "direct" | "group";
    room_name: string | null;
    last_message_text: string | null;
    last_message_at: string | null;
    created_at: string;
    updated_at: string;
    chat_room_users: Array<{
      user: {
        user_id: number;
        name: string;
        profile_image: string | null;
      }
    }>;
  };
}

/**
 * 채팅방 정보 타입
 */
export interface ChatRoom {
  chat_room_id: number;
  room_type: "direct" | "group";
  room_name: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 채팅방 생성 요청 타입
 */
export interface CreateChatRoomRequest {
  other_user_id: number;
}

/**
 * 채팅방 생성 (1:1 채팅)
 * POST /api/chat/rooms
 */
export async function createChatRoom(data: CreateChatRoomRequest): Promise<ChatRoom> {
  const response = await post<any>('/api/chat/rooms', data);

  console.log('채팅방 생성 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: {...} }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. { chat_room: {...} }
  if (response.chat_room) {
    return response.chat_room;
  }

  // 3. {...} (채팅방 객체 직접 반환)
  if (response.chat_room_id) {
    return response;
  }

  // 4. { data: {...} }
  if (response.data && response.data.chat_room_id) {
    return response.data;
  }

  throw new Error(response.message || '채팅방 생성에 실패했습니다.');
}

/**
 * 특정 채팅방 상세 조회
 * GET /api/chat/rooms/{chat_room_id}
 */
export async function getChatRoom(chatRoomId: number): Promise<ChatRoomUser> {
  const response = await get<any>(`/api/chat/rooms/${chatRoomId}`);

  console.log('채팅방 상세 조회 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: {...} }
  if (response.success && response.data) {
    return response.data;
  }

  // 2. {...} (객체 직접 반환)
  if (response.chat_room_user_id) {
    return response;
  }

  // 3. { data: {...} }
  if (response.data && response.data.chat_room_user_id) {
    return response.data;
  }

  throw new Error(response.message || '채팅방 정보를 가져올 수 없습니다.');
}

/**
 * 내 채팅방 목록 조회
 * GET /api/chat/rooms
 */
export async function getChatRooms(): Promise<ChatRoomUser[]> {
  const response = await get<any>('/api/chat/rooms');

  console.log('채팅방 목록 조회 응답:', response);

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

  throw new Error(response.message || '채팅방 목록을 가져올 수 없습니다.');
}

/**
 * 특정 채팅방 메시지 히스토리 조회
 * GET /api/chat/rooms/{chat_room_id}/messages
 */
export async function getChatMessages(chatRoomId: number): Promise<Message[]> {
  const response = await get<any>(`/api/chat/rooms/${chatRoomId}/messages`);

  console.log('채팅 메시지 조회 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { messages: [...] } }
  if (response.success && response.data?.messages) {
    return response.data.messages;
  }

  // 2. { success: true, data: [...] }
  if (response.success && response.data && Array.isArray(response.data)) {
    return response.data;
  }

  // 3. [...] (배열 직접 반환)
  if (Array.isArray(response)) {
    return response;
  }

  // 4. { data: { messages: [...] } }
  if (response.data?.messages && Array.isArray(response.data.messages)) {
    return response.data.messages;
  }

  // 5. { data: [...] }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }

  // 6. { messages: [...] }
  if (response.messages && Array.isArray(response.messages)) {
    return response.messages;
  }

  throw new Error(response.message || '메시지를 가져올 수 없습니다.');
}

/**
 * 채팅방 나가기
 * DELETE /api/chat/rooms/{chat_room_id}
 */
export async function leaveChatRoom(chatRoomId: number): Promise<void> {
  const response = await del<any>(`/api/chat/rooms/${chatRoomId}`);

  console.log('채팅방 나가기 응답:', response);

  // 성공 여부 확인
  if (response.success === false) {
    throw new Error(response.message || '채팅방 나가기에 실패했습니다.');
  }

  // 응답이 없거나 success가 없으면 성공으로 간주
}

/**
 * 읽지 않은 메시지 총 개수 조회
 * GET /api/chat/unread-count
 */
export async function getUnreadCount(): Promise<number> {
  const response = await get<any>('/api/chat/unread-count');

  console.log('읽지 않은 메시지 개수 조회 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, data: { unread_count: 5 } }
  if (response.success && response.data?.unread_count !== undefined) {
    return response.data.unread_count;
  }

  // 2. { unread_count: 5 }
  if (response.unread_count !== undefined) {
    return response.unread_count;
  }

  // 3. { data: { unread_count: 5 } }
  if (response.data?.unread_count !== undefined) {
    return response.data.unread_count;
  }

  // 4. 숫자 직접 반환
  if (typeof response === 'number') {
    return response;
  }

  throw new Error(response.message || '읽지 않은 메시지 개수를 가져올 수 없습니다.');
}

/**
 * 메시지 삭제 (자신의 메시지만)
 * DELETE /api/chat/messages/{message_id}
 */
export async function deleteMessage(messageId: number): Promise<void> {
  const response = await del<any>(`/api/chat/messages/${messageId}`);

  console.log('메시지 삭제 응답:', response);

  // 성공 여부 확인
  if (response.success === false) {
    throw new Error(response.message || '메시지 삭제에 실패했습니다.');
  }

  // 응답이 없거나 success가 없으면 성공으로 간주
}

/**
 * 채팅 이미지 업로드
 * POST /api/chat/upload
 */
export async function uploadChatImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await uploadFile<any>('/api/chat/upload', formData);

  console.log('채팅 이미지 업로드 응답:', response);

  // 다양한 응답 형식 처리
  // 1. { success: true, imageUrl: "..." }
  if (response.success && response.imageUrl) {
    return response.imageUrl;
  }

  // 2. { imageUrl: "..." }
  if (response.imageUrl) {
    return response.imageUrl;
  }

  // 3. { success: true, data: { imageUrl: "..." } }
  if (response.success && response.data?.imageUrl) {
    return response.data.imageUrl;
  }

  // 4. { data: { imageUrl: "..." } }
  if (response.data?.imageUrl) {
    return response.data.imageUrl;
  }

  throw new Error(response.message || '이미지 업로드에 실패했습니다.');
}
