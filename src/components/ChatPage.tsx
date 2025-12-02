import { useState, useEffect, useCallback } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { MessageSquare, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { getChatRooms, type ChatRoomUser } from "../services/chatService";
import { useWebSocket, type WebSocketMessage } from "../hooks/useWebSocket";

interface ChatPageProps {
  onChatRoomClick: (chatRoomId: number) => void;
}

export function ChatPage({ onChatRoomClick }: ChatPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatRooms, setChatRooms] = useState<ChatRoomUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  // WebSocket 메시지 수신 핸들러
  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    console.log('ChatPage - WebSocket 메시지 수신:', wsMessage);

    // 메시지 삭제 이벤트 처리
    if (wsMessage.type === 'message_deleted' && wsMessage.data) {
      const { chat_room_id, updated_last_message } = wsMessage.data;

      // 마지막 메시지가 업데이트된 경우에만 처리
      if (updated_last_message !== null) {
        console.log('마지막 메시지 업데이트:', chat_room_id, updated_last_message);

        setChatRooms(prev => prev.map(room => {
          if (room.chat_room.chat_room_id === chat_room_id) {
            return {
              ...room,
              chat_room: {
                ...room.chat_room,
                last_message_text: updated_last_message.last_message_text,
                last_message_at: updated_last_message.last_message_at,
              }
            };
          }
          return room;
        }));
      }
    }

    // 사용자 온라인 상태 변경 처리
    if (wsMessage.type === 'user_status' && wsMessage.data) {
      const { user_id, is_online } = wsMessage.data;
      console.log(`ChatPage - 사용자 ${user_id} 상태 변경: ${is_online ? '온라인' : '오프라인'}`);

      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (is_online) {
          newSet.add(user_id);
        } else {
          newSet.delete(user_id);
        }
        return newSet;
      });
    }
  }, []);

  // WebSocket 연결
  useWebSocket({
    onMessage: handleWebSocketMessage,
    autoConnect: true
  });

  // 채팅방 목록 가져오기
  useEffect(() => {
    loadChatRooms();

    // 좋아요 취소 시 채팅방 목록 새로고침
    const handleChatRoomsChanged = () => {
      console.log('채팅방 목록 변경 감지, 새로고침 중...');
      loadChatRooms();
    };

    window.addEventListener('chatRoomsChanged', handleChatRoomsChanged);

    return () => {
      window.removeEventListener('chatRoomsChanged', handleChatRoomsChanged);
    };
  }, []);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const rooms = await getChatRooms();
      setChatRooms(rooms);
    } catch (err: any) {
      console.error('채팅방 목록 로드 실패:', err);
      setError(err.message || '채팅방 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (chatRoom: ChatRoomUser) => {
    // 1:1 채팅에서 상대방 정보 가져오기
    return chatRoom.chat_room.chat_room_users[0]?.user;
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString();
  };

  const filteredChatRooms = chatRooms.filter(room => {
    const otherUser = getOtherUser(room);
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalUnreadCount = chatRooms.reduce((sum, room) => sum + room.unread_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl">채팅</h1>
            {totalUnreadCount > 0 && (
              <Badge className="bg-red-500 text-white border-0 px-3 py-1">
                {totalUnreadCount}개의 새 메시지
              </Badge>
            )}
          </div>
          <p className="text-gray-600">매칭된 러닝 메이트와 대화하세요</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-2">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadChatRooms}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                다시 시도
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto" size={48} />
              <p className="mt-4 text-gray-600">채팅 목록을 불러오는 중...</p>
            </div>
          ) : filteredChatRooms.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl mb-2">채팅방이 없습니다</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "검색 결과가 없습니다"
                  : "매칭된 러닝 메이트와 대화를 시작해보세요!"}
              </p>
            </div>
          ) : (
            filteredChatRooms.map((room) => {
              const otherUser = getOtherUser(room);
              if (!otherUser) return null;

              return (
                <div
                  key={room.chat_room.chat_room_id}
                  onClick={() => onChatRoomClick(room.chat_room.chat_room_id)}
                  className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#1e3a8a] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100">
                        <ImageWithFallback
                          src={otherUser.profile_image || ""}
                          alt={otherUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {room.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {room.unread_count}
                        </div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg group-hover:text-[#1e3a8a] transition-colors">
                          {otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(room.chat_room.last_message_at)}
                        </span>
                      </div>
                      <p className={`text-xs mb-1 ${onlineUsers.has(otherUser.user_id) ? 'text-gray-700 font-semibold' : 'text-gray-500'}`}>
                        {onlineUsers.has(otherUser.user_id) ? '온라인' : '오프라인'}
                      </p>
                      <p className={`text-sm truncate ${
                        room.unread_count > 0 ? "text-gray-900 font-medium" : "text-gray-500"
                      }`}>
                        {room.chat_room.last_message_text || "메시지가 없습니다"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State Hint */}
        {!loading && chatRooms.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              💡 둘러보기에서 관심있는 메이트에게 좋아요를 보내고<br />
              매칭이 되면 채팅을 시작할 수 있어요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
