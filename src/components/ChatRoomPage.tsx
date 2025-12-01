import { useState, useEffect, useRef, useCallback } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Send, Image as ImageIcon, Smile, Loader2, MoreVertical, Trash2, X } from "lucide-react";
import { getChatMessages, getChatRoom, deleteMessage, uploadChatImage, type Message, type ChatRoomUser } from "../services/chatService";
import { useWebSocket, type WebSocketMessage } from "../hooks/useWebSocket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  const [chatRoomData, setChatRoomData] = useState<ChatRoomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // 메시지 삭제 이벤트 처리
    if (wsMessage.type === 'message_deleted' && wsMessage.data) {
      const { message_id, chat_room_id } = wsMessage.data;
      if (chat_room_id === chatRoomId) {
        console.log('메시지 삭제 이벤트 수신:', message_id);
        setMessages(prev => prev.filter(m => m.message_id !== message_id));
      }
    }
  }, [chatRoomId]);

  // WebSocket 연결
  const { sendMessage: sendWebSocketMessage, joinRoom, leaveRoom, isConnected } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: () => console.log('WebSocket 연결됨'),
    onDisconnect: () => console.log('WebSocket 연결 해제됨'),
    autoConnect: true
  });

  // 채팅방 입장/퇴장
  useEffect(() => {
    if (isConnected) {
      joinRoom(chatRoomId);
    }

    return () => {
      if (isConnected) {
        leaveRoom(chatRoomId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId, isConnected]); // joinRoom과 leaveRoom을 의존성에서 제거

  // 채팅방 정보 및 메시지 히스토리 로드
  useEffect(() => {
    loadChatRoomData();
  }, [chatRoomId]);

  const loadChatRoomData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 채팅방 정보 및 메시지 히스토리 병렬로 가져오기
      const [roomData, messageHistory] = await Promise.all([
        getChatRoom(chatRoomId),
        getChatMessages(chatRoomId)
      ]);

      console.log('채팅방 데이터:', roomData);
      setChatRoomData(roomData);
      setMessages(messageHistory);
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
        chat_room_id: chatRoomId,
        message_text: newMessage,
        message_type: 'text'
      });

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

  // 메시지 삭제
  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm('이 메시지를 삭제하시겠습니까?')) return;

    try {
      await deleteMessage(messageId);

      // 로컬 상태에서 메시지 제거
      setMessages(messages.filter(m => m.message_id !== messageId));

      console.log('메시지 삭제 완료:', messageId);
    } catch (err: any) {
      console.error('메시지 삭제 실패:', err);
      alert(err.message || '메시지 삭제에 실패했습니다.');
    }
  };

  // 이미지 선택
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택할 수 있습니다.');
      return;
    }

    // 파일 크기 확인 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('이미지 파일 크기는 2MB 이하여야 합니다.');
      return;
    }

    setSelectedImage(file);

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 이미지 선택 취소
  const handleImageCancel = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 메시지 전송
  const handleSendImageMessage = async () => {
    if (!selectedImage || uploading || !isConnected) return;

    setUploading(true);

    try {
      // 1. 이미지 업로드
      const imageUrl = await uploadChatImage(selectedImage);

      // 2. WebSocket으로 이미지 메시지 전송
      sendWebSocketMessage({
        chat_room_id: chatRoomId,
        message_text: imageUrl,
        message_type: 'image'
      });

      // 3. 상태 초기화
      handleImageCancel();
    } catch (error: any) {
      console.error('이미지 전송 실패:', error);
      alert(error.message || '이미지 전송에 실패했습니다.');
    } finally {
      setUploading(false);
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

  if (!chatRoomData) {
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

  // 상대방 정보 추출
  const otherUser = chatRoomData.chat_room.chat_room_users[0]?.user;

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">상대방 정보를 찾을 수 없습니다</p>
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
              src={otherUser.profile_image || ""}
              alt={otherUser.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="font-medium">{otherUser.name}</h2>
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
                <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 ${isMyMessage ? "flex-row-reverse" : ""} max-w-[70%]`}>
                    {!isMyMessage && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                        <ImageWithFallback
                          src={message.sender.profile_image || ""}
                          alt={message.sender.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}>
                      {!isMyMessage && (
                        <span className="text-xs text-gray-600 mb-1 ml-1">
                          {message.sender.name}
                        </span>
                      )}

                      {/* 이미지 메시지 */}
                      {message.message_type === 'image' ? (
                        <div className="rounded-2xl overflow-hidden max-w-xs">
                          <img
                            src={message.message_text}
                            alt="채팅 이미지"
                            className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.message_text, '_blank')}
                          />
                        </div>
                      ) : (
                        /* 텍스트 메시지 */
                        <div className={`rounded-2xl px-4 py-2 ${
                          isMyMessage
                            ? "bg-[#1e3a8a] text-white"
                            : "bg-white border border-gray-200"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.message_text}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <span>{formatMessageTime(message.created_at)}</span>
                        {isMyMessage && message.is_read && (
                          <span className="text-[#1e3a8a]">읽음</span>
                        )}
                      </div>
                    </div>

                    {/* 내 메시지인 경우 삭제 버튼 표시 */}
                    {isMyMessage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors self-start">
                            <MoreVertical size={16} className="text-gray-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteMessage(message.message_id)}
                            className="text-red-600 cursor-pointer"
                          >
                            <Trash2 size={16} className="mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
        <div className="max-w-4xl mx-auto">
          {/* 이미지 미리보기 */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img
                src={imagePreview}
                alt="미리보기"
                className="h-32 rounded-lg border border-gray-200"
              />
              <button
                onClick={handleImageCancel}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Image upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={uploading}
            >
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
                disabled={uploading || !!selectedImage}
              />
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Smile size={24} className="text-gray-600" />
            </button>

            {/* 이미지가 선택되었으면 이미지 전송, 아니면 텍스트 전송 */}
            {selectedImage ? (
              <Button
                onClick={handleSendImageMessage}
                disabled={uploading}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] rounded-full w-10 h-10 p-0"
              >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </Button>
            ) : (
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] rounded-full w-10 h-10 p-0"
              >
                <Send size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
