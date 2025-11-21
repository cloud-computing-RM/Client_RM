import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { MessageSquare, Search } from "lucide-react";
import { Input } from "./ui/input";

interface ChatPageProps {
  onChatRoomClick: (chatRoomId: number) => void;
}

interface ChatRoom {
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

export function ChatPage({ onChatRoomClick }: ChatPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: API 연동 - 채팅방 목록 가져오기
  useEffect(() => {
    // 임시 더미 데이터
    const dummyChatRooms: ChatRoom[] = [
      {
        chat_room_user_id: 1,
        unread_count: 2,
        last_read_at: null,
        joined_at: "2024-01-15T10:00:00Z",
        chat_room: {
          chat_room_id: 1,
          room_type: "direct",
          room_name: null,
          last_message_text: "내일 오전 6시에 한강에서 만날까요?",
          last_message_at: "2024-01-20T15:30:00Z",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-20T15:30:00Z",
          chat_room_users: [
            {
              user: {
                user_id: 2,
                name: "김민준",
                profile_image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face"
              }
            }
          ]
        }
      },
      {
        chat_room_user_id: 2,
        unread_count: 0,
        last_read_at: "2024-01-20T14:00:00Z",
        joined_at: "2024-01-18T09:00:00Z",
        chat_room: {
          chat_room_id: 2,
          room_type: "direct",
          room_name: null,
          last_message_text: "오늘 러닝 정말 좋았어요!",
          last_message_at: "2024-01-20T14:00:00Z",
          created_at: "2024-01-18T09:00:00Z",
          updated_at: "2024-01-20T14:00:00Z",
          chat_room_users: [
            {
              user: {
                user_id: 3,
                name: "박지연",
                profile_image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
              }
            }
          ]
        }
      },
      {
        chat_room_user_id: 3,
        unread_count: 5,
        last_read_at: "2024-01-19T20:00:00Z",
        joined_at: "2024-01-10T11:00:00Z",
        chat_room: {
          chat_room_id: 3,
          room_type: "direct",
          room_name: null,
          last_message_text: "주말에 남산 코스 어때요?",
          last_message_at: "2024-01-20T16:45:00Z",
          created_at: "2024-01-10T11:00:00Z",
          updated_at: "2024-01-20T16:45:00Z",
          chat_room_users: [
            {
              user: {
                user_id: 4,
                name: "이태혁",
                profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
              }
            }
          ]
        }
      }
    ];

    setTimeout(() => {
      setChatRooms(dummyChatRooms);
      setLoading(false);
    }, 500);
  }, []);

  const getOtherUser = (chatRoom: ChatRoom) => {
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto"></div>
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
