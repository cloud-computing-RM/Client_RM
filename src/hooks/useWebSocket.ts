import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '../services/apiClient';

export interface WebSocketMessage {
  type: 'message' | 'read' | 'typing' | 'system' | 'like_received' | 'match' | 'achievement' | 'message_deleted' | 'user_status';
  chat_room_id?: number;
  message?: {
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
  };
  // 좋아요 수신 알림
  like?: {
    like_id: number;
    sender_id: number;
    sender: {
      user_id: number;
      name: string;
      profile_image: string | null;
    };
    created_at: string;
  };
  // 매칭 알림
  match?: {
    match_id: number;
    user_id: number;
    user: {
      user_id: number;
      name: string;
      profile_image: string | null;
    };
    created_at: string;
  };
  // 업적 달성 알림
  achievement?: {
    achievement_id: number;
    name: string;
    description: string;
    icon?: string;
    reward_points?: number;
  };
  data?: any;
}

export interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoConnect = true
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Socket.IO 연결
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('Socket.IO already connected');
      return;
    }

    try {
      // API 서버 주소 가져오기
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      // 토큰 가져오기
      const token = tokenStorage.get();

      if (!token) {
        console.error('No authentication token found');
        setConnectionError('인증 토큰이 없습니다.');
        return;
      }

      console.log('Connecting to Socket.IO:', apiUrl);

      // Socket.IO 클라이언트 생성
      const socket = io(apiUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      // 연결 성공
      socket.on('connect', () => {
        console.log('Socket.IO connected');
        setIsConnected(true);
        setConnectionError(null);
        onConnect?.();
      });

      // 연결 해제
      socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason);
        setIsConnected(false);
        onDisconnect?.();
      });

      // 연결 오류
      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        setConnectionError(error.message || 'Socket.IO 연결 오류가 발생했습니다.');
        onError?.(error);
      });

      // 일반 오류
      socket.on('error', (error: any) => {
        console.error('Socket.IO error:', error);
        setConnectionError(error.message || 'Socket.IO 오류가 발생했습니다.');
      });

      // 새 메시지 수신 (백엔드에서 'new_message' 이벤트로 전송)
      socket.on('new_message', (data: { message: any; chat_room_id: number }) => {
        console.log('New message received:', data);
        onMessage?.({
          type: 'message',
          chat_room_id: data.chat_room_id,
          message: data.message
        });
      });

      // 메시지 읽음 처리
      socket.on('messages_read', (data: any) => {
        console.log('Messages read:', data);
        onMessage?.({
          type: 'read',
          data
        });
      });

      // 타이핑 중 표시
      socket.on('user_typing', (data: any) => {
        console.log('User typing:', data);
        onMessage?.({
          type: 'typing',
          data
        });
      });

      // 좋아요 수신 알림 (백엔드에서 구현 필요)
      socket.on('like_received', (data: any) => {
        console.log('Like received:', data);
        onMessage?.({
          type: 'like_received',
          like: data
        });
      });

      // 매칭 알림 (백엔드에서 구현 필요)
      socket.on('match', (data: any) => {
        console.log('Match notification:', data);
        onMessage?.({
          type: 'match',
          match: data
        });
      });

      // 업적 달성 알림 (백엔드에서 구현 필요)
      socket.on('achievement', (data: any) => {
        console.log('Achievement unlocked:', data);
        onMessage?.({
          type: 'achievement',
          achievement: data
        });
      });

      // 메시지 삭제 알림
      socket.on('message_deleted', (data: any) => {
        console.log('Message deleted:', data);
        onMessage?.({
          type: 'message_deleted',
          data
        });
      });

      // 사용자 온라인/오프라인 상태 변경 알림
      socket.on('user_status_changed', (data: any) => {
        console.log('User status changed:', data);
        onMessage?.({
          type: 'user_status',
          data
        });
      });

      // 채팅방 입장 성공 (초기 온라인 상태 포함)
      socket.on('joined_room', (data: any) => {
        console.log('Joined room with initial status:', data);

        // 초기 온라인 상태 정보 전달
        if (data.other_users_status && Array.isArray(data.other_users_status)) {
          data.other_users_status.forEach((userStatus: any) => {
            onMessage?.({
              type: 'user_status',
              data: {
                user_id: userStatus.user_id,
                is_online: userStatus.is_online
              }
            });
          });
        }
      });

    } catch (error: any) {
      console.error('Failed to create Socket.IO connection:', error);
      setConnectionError('Socket.IO 연결에 실패했습니다.');
      onError?.(error);
    }
  }, [onConnect, onMessage, onError, onDisconnect]);

  // Socket.IO 연결 해제
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // 채팅방 입장
  const joinRoom = useCallback((chatRoomId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', { chat_room_id: chatRoomId });
      console.log('Joined room:', chatRoomId);
    } else {
      console.error('Socket.IO is not connected');
    }
  }, []);

  // 채팅방 퇴장
  const leaveRoom = useCallback((chatRoomId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave_room', { chat_room_id: chatRoomId });
      console.log('Left room:', chatRoomId);
    }
  }, []);

  // 메시지 전송
  const sendMessage = useCallback((data: {
    chat_room_id: number;
    message_text: string;
    message_type?: string;
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data);
      console.log('Message sent:', data);
    } else {
      console.error('Socket.IO is not connected');
      throw new Error('Socket.IO가 연결되지 않았습니다.');
    }
  }, []);

  // 메시지 읽음 처리
  const markAsRead = useCallback((data: {
    chat_room_id: number;
    message_ids?: number[];
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark_as_read', data);
      console.log('Marked as read:', data);
    }
  }, []);

  // 타이핑 중 표시
  const sendTyping = useCallback((data: {
    chat_room_id: number;
    is_typing: boolean;
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', data);
    }
  }, []);

  // 컴포넌트 마운트 시 자동 연결
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect]); // connect와 disconnect를 의존성에서 제거

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    markAsRead,
    sendTyping
  };
}
