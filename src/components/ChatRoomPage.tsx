import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Send, Image as ImageIcon, Smile } from "lucide-react";

interface ChatRoomPageProps {
  chatRoomId: number;
  onBack: () => void;
}

interface Message {
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
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 1; // TODO: 실제 로그인한 사용자 ID로 변경

  // TODO: API 연동 - 채팅방 정보 및 메시지 가져오기
  useEffect(() => {
    // 임시 더미 데이터
    const dummyChatRoomInfo: ChatRoomInfo = {
      chat_room_id: chatRoomId,
      room_type: "direct",
      room_name: null,
      other_user: {
        user_id: 2,
        name: "김민준",
        profile_image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face"
      }
    };

    const dummyMessages: Message[] = [
      {
        message_id: 1,
        chat_room_id: chatRoomId,
        sender_id: 2,
        message_text: "안녕하세요! 프로필 봤는데 러닝 스타일이 잘 맞을 것 같아요.",
        message_type: "text",
        is_read: true,
        read_at: "2024-01-20T10:30:00Z",
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-20T10:00:00Z",
        sender: {
          user_id: 2,
          name: "김민준",
          profile_image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face"
        }
      },
      {
        message_id: 2,
        chat_room_id: chatRoomId,
        sender_id: 1,
        message_text: "네! 저도 프로필 봤어요. 페이스가 비슷하네요 😊",
        message_type: "text",
        is_read: true,
        read_at: "2024-01-20T11:00:00Z",
        created_at: "2024-01-20T10:30:00Z",
        updated_at: "2024-01-20T10:30:00Z",
        sender: {
          user_id: 1,
          name: "나",
          profile_image: null
        }
      },
      {
        message_id: 3,
        chat_room_id: chatRoomId,
        sender_id: 2,
        message_text: "주로 어디서 뛰시나요?",
        message_type: "text",
        is_read: true,
        read_at: "2024-01-20T11:15:00Z",
        created_at: "2024-01-20T11:00:00Z",
        updated_at: "2024-01-20T11:00:00Z",
        sender: {
          user_id: 2,
          name: "김민준",
          profile_image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face"
        }
      },
      {
        message_id: 4,
        chat_room_id: chatRoomId,
        sender_id: 1,
        message_text: "한강공원에서 주로 뛰어요. 저녁 시간대에요!",
        message_type: "text",
        is_read: true,
        read_at: "2024-01-20T14:00:00Z",
        created_at: "2024-01-20T11:15:00Z",
        updated_at: "2024-01-20T11:15:00Z",
        sender: {
          user_id: 1,
          name: "나",
          profile_image: null
        }
      },
      {
        message_id: 5,
        chat_room_id: chatRoomId,
        sender_id: 2,
        message_text: "오 저도 한강 자주 가요! 내일 오전 6시에 한강에서 만날까요?",
        message_type: "text",
        is_read: false,
        read_at: null,
        created_at: "2024-01-20T15:30:00Z",
        updated_at: "2024-01-20T15:30:00Z",
        sender: {
          user_id: 2,
          name: "김민준",
          profile_image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face"
        }
      }
    ];

    setTimeout(() => {
      setChatRoomInfo(dummyChatRoomInfo);
      setMessages(dummyMessages);
      setLoading(false);
    }, 500);
  }, [chatRoomId]);

  // 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);

    // TODO: API 연동 - 메시지 전송
    const newMsg: Message = {
      message_id: Date.now(),
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
        name: "나",
        profile_image: null
      }
    };

    setTimeout(() => {
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      setSending(false);
    }, 300);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto"></div>
          <p className="mt-4 text-gray-600">채팅방을 불러오는 중...</p>
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
            <p className="text-xs text-gray-500">온라인</p>
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
