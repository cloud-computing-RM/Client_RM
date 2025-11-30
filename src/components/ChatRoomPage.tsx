import { useState, useEffect, useRef, useCallback } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Send, Image as ImageIcon, Smile, Loader2 } from "lucide-react";
import { getChatMessages, type Message } from "../services/chatService";
import { useWebSocket, type WebSocketMessage } from "../hooks/useWebSocket";

interface ChatRoomPageProps {
  chatRoomId: number;
  onBack: () => void;
}

interface ChatRoomInfo {
  chat_room_id: number;
  room_type: "direct" | "group";
  room_name: string | null;
  other_user: {
    user_id: number;
    name: string;
    profile_image: string | null;
  };
}

export function ChatRoomPage({ chatRoomId, onBack }: ChatRoomPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 현재 로그인한 사용자 ID 가져오기
  const currentUser = JSON.parse(localStorage.getItem('runmate_user') || 'null');
  const currentUserId = currentUser?.user_id || 1;

  // WebSocket 메시지 수신 핸들러
  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    console.log('WebSocket 메시지 수신:', wsMessage);

    // 현재 채팅방의 메시지만 처리
    if (wsMessage.type === 'message' && wsMessage.message) {
      if (wsMessage.message.chat_room_id === chatRoomId) {
        setMessages(prev => {
          // 중복 방지: 같은 message_id가 이미 있으면 추가하지 않음
          if (prev.some(m => m.message_id === wsMessage.message!.message_id)) {
            return prev;
          }
          return [...prev, wsMessage.message!];
        });
      }
    }
  }, [chatRoomId]);

  // WebSocket 연결
  const { sendMessage: sendWebSocketMessage, isConnected } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: () => console.log('WebSocket 연결됨'),
    onDisconnect: () => console.log('WebSocket 연결 해제됨'),
    autoConnect: true
  });

  // 채팅방 정보 및 메시지 히스토리 로드
  useEffect(() => {
    loadChatRoomData();
  }, [chatRoomId]);

  const loadChatRoomData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 메시지 히스토리 가져오기
      const messageHistory = await getChatMessages(chatRoomId);
      setMessages(messageHistory);

      // 채팅방 정보 설정 (메시지에서 추출)
      if (messageHistory.length > 0) {
        const firstMessage = messageHistory[0];
        const otherUser = firstMessage.sender_id === currentUserId
          ? null // 상대방 정보가 필요하면 API에서 가져와야 함
          : firstMessage.sender;

        setChatRoomInfo({
          chat_room_id: chatRoomId,
          room_type: "direct",
          room_name: null,
          other_user: otherUser || {
            user_id: 0,
            name: "Unknown",
            profile_image: null
          }
        });
      } else {
        // 메시지가 없을 경우 기본값 설정
        setChatRoomInfo({
          chat_room_id: chatRoomId,
          room_type: "direct",
          room_name: null,
          other_user: {
            user_id: 0,
            name: "채팅 상대",
            profile_image: null
          }
        });
      }
    } catch (err: any) {
      console.error('채팅방 데이터 로드 실패:', err);
      setError(err.message || '채팅방을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !isConnected) return;

    setSending(true);

    try {
      // WebSocket을 통해 메시지 전송
      sendWebSocketMessage({
        type: 'message',
        chat_room_id: chatRoomId,
        message_text: newMessage,
        message_type: 'text'
      });

      // 임시로 로컬에 추가 (WebSocket 응답으로 다시 받을 것임)
      const tempMsg: Message = {
        message_id: Date.now(), // 임시 ID
        chat_room_id: chatRoomId,
        sender_id: currentUserId,
        message_text: newMessage,
        message_type: "text",
        is_read: false,
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: {
          user_id: currentUserId,
          name: currentUser?.name || "나",
          profile_image: currentUser?.profile_image || null
        }
      };

      setMessages(prev => [...prev, tempMsg]);
      setNewMessage("");
    } catch (error: any) {
      console.error('메시지 전송 실패:', error);
      alert(error.message || '메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "오늘";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제";
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  };

  const shouldShowDateDivider = (index: number) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].created_at).toDateString();
    const prevDate = new Date(messages[index - 1].created_at).toDateString();
    return currentDate !== prevDate;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto" size={48} />
          <p className="mt-4 text-gray-600">채팅방을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadChatRoomData} className="mr-2">
            다시 시도
          </Button>
          <Button onClick={onBack} variant="outline">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (!chatRoomInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">채팅방을 찾을 수 없습니다</p>
          <Button onClick={onBack} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
            <ImageWithFallback
              src={chatRoomInfo.other_user.profile_image || ""}
              alt={chatRoomInfo.other_user.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="font-medium">{chatRoomInfo.other_user.name}</h2>
            <p className="text-xs text-gray-500">
              {isConnected ? '온라인' : '연결 중...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => {
            const isMyMessage = message.sender_id === currentUserId;
            const showDate = shouldShowDateDivider(index);

            return (
              <div key={message.message_id}>
                {/* Date Divider */}
                {showDate && (
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatMessageDate(message.created_at)}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className={`flex gap-3 ${isMyMessage ? "flex-row-reverse" : ""}`}>
                  {!isMyMessage && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                      <ImageWithFallback
                        src={message.sender.profile_image || ""}
                        alt={message.sender.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"} max-w-[70%]`}>
                    {!isMyMessage && (
                      <span className="text-xs text-gray-600 mb-1 ml-1">
                        {message.sender.name}
                      </span>
                    )}

                    <div className={`rounded-2xl px-4 py-2 ${
                      isMyMessage
                        ? "bg-[#1e3a8a] text-white"
                        : "bg-white border border-gray-200"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.message_text}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <span>{formatMessageTime(message.created_at)}</span>
                      {isMyMessage && message.is_read && (
                        <span className="text-[#1e3a8a]">읽음</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ImageIcon size={24} className="text-gray-600" />
          </button>

          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
            <Input
              type="text"
              placeholder="메시지를 입력하세요..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Smile size={24} className="text-gray-600" />
          </button>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-[#1e3a8a] hover:bg-[#1e40af] rounded-full w-10 h-10 p-0"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
