import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, MapPin, Heart, Loader2, Sparkles, Users, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getSentLikes, getReceivedLikes, getMatches, cancelLike, sendLike } from "../services/likeService";
import { useWebSocket, type WebSocketMessage } from "../hooks/useWebSocket";
import type { Like, Match } from "../services/likeService";

interface LikedMatesPageProps {
  onBack: () => void;
}

export function LikedMatesPage({ onBack }: LikedMatesPageProps) {
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [receivedLikes, setReceivedLikes] = useState<Like[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("matches");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  // WebSocket 메시지 수신 핸들러
  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    console.log('LikedMatesPage - WebSocket 메시지 수신:', wsMessage);

    // 좋아요 수신 시 자동 새로고침
    if (wsMessage.type === 'like_received' && wsMessage.like) {
      const senderName = wsMessage.like.sender.name;
      setNotification(`${senderName}님이 관심을 보냈습니다! 💝`);
      setTimeout(() => setNotification(null), 3000);

      // 받은 좋아요 목록 새로고침
      loadAllData();
    }

    // 매칭 성공 시 자동 새로고침
    if (wsMessage.type === 'match' && wsMessage.match) {
      const userName = wsMessage.match.user.name;
      setNotification(`${userName}님과 매칭되었습니다! 🎉`);
      setTimeout(() => setNotification(null), 3000);

      // 매칭 목록 새로고침
      loadAllData();
    }
  }, []);

  // WebSocket 연결
  const { isConnected } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: () => console.log('LikedMatesPage - WebSocket 연결됨'),
    onDisconnect: () => console.log('LikedMatesPage - WebSocket 연결 해제됨'),
    autoConnect: true
  });

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sentData, receivedData, matchesData] = await Promise.all([
        getSentLikes(),
        getReceivedLikes(),
        getMatches(),
      ]);

      console.log('보낸 좋아요:', sentData.length, '명');
      console.log('받은 좋아요:', receivedData.length, '명');
      console.log('매칭:', matchesData.length, '명');

      setSentLikes(sentData);
      setReceivedLikes(receivedData);
      setMatches(matchesData);
    } catch (err: any) {
      console.error('데이터 로드 실패:', err);
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLike = async (likeId: number) => {
    if (!window.confirm('좋아요를 취소하시겠습니까?\n매칭이 해제되고 채팅방도 삭제됩니다.')) return;

    try {
      // 취소할 좋아요 찾기
      const likeToCancel = sentLikes.find(like => like.like_id === likeId);
      if (!likeToCancel) {
        console.error('취소할 좋아요를 찾을 수 없음:', likeId);
        return;
      }

      console.log('좋아요 취소 시작:', { likeId, receiver_id: likeToCancel.receiver_id });

      // API 호출
      await cancelLike(likeId);
      console.log('좋아요 취소 API 호출 성공');

      // 성공 메시지
      alert('좋아요가 취소되었습니다.');

      // 데이터 새로고침
      await loadAllData();

      // 다른 컴포넌트에 알림 (ProfilePage, ChatPage)
      window.dispatchEvent(new Event('likedProfilesChanged'));
      window.dispatchEvent(new Event('chatRoomsChanged'));
    } catch (err: any) {
      console.error('좋아요 취소 실패:', err);
      alert(err.message || '좋아요 취소에 실패했습니다.');
    }
  };

  const handleSendLike = async (receiverId: number) => {
    try {
      console.log('좋아요 보내기 시작:', { receiverId });

      // API 호출
      const result = await sendLike(receiverId);
      console.log('좋아요 보내기 결과:', result);

      // 매칭 알림
      if (result.isMatch) {
        setNotification(`매칭되었습니다! 🎉`);
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification(`좋아요를 보냈습니다! 💝`);
        setTimeout(() => setNotification(null), 3000);
      }

      // 데이터 새로고침
      await loadAllData();

      // 다른 컴포넌트에 알림 (ProfilePage)
      window.dispatchEvent(new Event('likedProfilesChanged'));
    } catch (err: any) {
      console.error('좋아요 보내기 실패:', err);
      alert(err.message || '좋아요 보내기에 실패했습니다.');
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('runmate_user') || 'null');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 알림 */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
            <Heart size={20} fill="white" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <h2 className="flex-1">러닝 메이트</h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin" size={40} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadAllData}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="matches" className="relative">
                매칭
                {matches.length > 0 && (
                  <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {matches.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="received" className="relative">
                받은 좋아요
                {receivedLikes.length > 0 && (
                  <span className="ml-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {receivedLikes.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent">
                보낸 좋아요
                {sentLikes.length > 0 && (
                  <span className="ml-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {sentLikes.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* 매칭 탭 */}
            <TabsContent value="matches">
              {matches.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl mb-2">아직 매칭된 메이트가 없어요</h3>
                  <p className="text-gray-600">서로 좋아요를 보내면 매칭됩니다!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match: any) => {
                    // 백엔드 응답: { like_id, matched_user, matched_at, chat_room_id }
                    const otherUser = match.matched_user;
                    const matchDate = match.matched_at;

                    return (
                      <Card key={match.like_id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex gap-4 p-4">
                            <div className="relative flex-shrink-0">
                              <ImageWithFallback
                                src={otherUser?.profile_image || ""}
                                alt={otherUser?.name || "User"}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                                <Sparkles size={14} />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-medium mb-1">
                                {otherUser?.name || "알 수 없음"}, {otherUser?.age || "?"}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin size={14} className="mr-1" />
                                {otherUser?.location || "알 수 없음"}
                              </div>
                              <p className="text-xs text-gray-500">
                                {matchDate ? new Date(matchDate).toLocaleDateString('ko-KR') : ''} 매칭됨
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* 받은 좋아요 탭 */}
            <TabsContent value="received">
              {receivedLikes.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl mb-2">받은 좋아요가 없어요</h3>
                  <p className="text-gray-600">다른 러너들이 관심을 보내면 여기에 표시됩니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedLikes.map((like) => (
                    <Card key={like.like_id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          <div className="relative flex-shrink-0">
                            <ImageWithFallback
                              src={like.sender?.profile_image || ""}
                              alt={like.sender?.name || "User"}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium mb-1">
                                  {like.sender?.name}, {like.sender?.age || "?"}
                                </h3>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <MapPin size={14} className="mr-1" />
                                  {like.sender?.location}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(like.created_at).toLocaleDateString('ko-KR')}
                                </p>
                              </div>
                              <button
                                onClick={() => handleSendLike(like.sender?.user_id || 0)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={like.is_matched ? "매칭됨" : "좋아요 보내기"}
                                disabled={!like.sender?.user_id}
                              >
                                <Heart
                                  size={20}
                                  className={like.is_matched ? "text-red-500" : "text-gray-400"}
                                  fill={like.is_matched ? "currentColor" : "none"}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* 보낸 좋아요 탭 */}
            <TabsContent value="sent">
              {sentLikes.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl mb-2">보낸 좋아요가 없어요</h3>
                  <p className="text-gray-600">둘러보기에서 마음에 드는 메이트에게 좋아요를 보내보세요!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentLikes.map((like) => (
                    <Card key={like.like_id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          <div className="relative flex-shrink-0">
                            <ImageWithFallback
                              src={like.receiver?.profile_image || ""}
                              alt={like.receiver?.name || "User"}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium mb-1">
                                  {like.receiver?.name}, {like.receiver?.age || "?"}
                                </h3>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <MapPin size={14} className="mr-1" />
                                  {like.receiver?.location}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(like.created_at).toLocaleDateString('ko-KR')}
                                </p>
                              </div>
                              <button
                                onClick={() => handleCancelLike(like.like_id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Heart size={20} className="text-red-500" fill="currentColor" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
