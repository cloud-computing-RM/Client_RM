import { useEffect, useRef, useCallback, useState } from 'react';
import { tokenStorage } from '../services/apiClient';

export interface WebSocketMessage {
  type: 'message' | 'read' | 'typing' | 'system';
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
  data?: any;
}

export interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
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

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // WebSocket URL 설정
  const getWebSocketUrl = useCallback(() => {
    // 프로토콜 결정 (https면 wss, http면 ws)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // API 서버 주소 가져오기 (환경변수나 설정에서)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const wsUrl = apiUrl.replace(/^http/, 'ws');

    // 토큰 가져오기
    const token = tokenStorage.get();

    return `${wsUrl}/ws?token=${token}`;
  }, []);

  // WebSocket 연결
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('WebSocket 연결 오류가 발생했습니다.');
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        onDisconnect?.();

        // 자동 재연결 시도
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          setConnectionError('WebSocket 재연결에 실패했습니다.');
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionError('WebSocket 연결에 실패했습니다.');
    }
  }, [getWebSocketUrl, onConnect, onMessage, onError, onDisconnect]);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  // 메시지 전송
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      console.log('WebSocket message sent:', message);
    } else {
      console.error('WebSocket is not connected');
      throw new Error('WebSocket이 연결되지 않았습니다.');
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
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage
  };
}
