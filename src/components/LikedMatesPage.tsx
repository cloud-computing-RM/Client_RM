import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Heart, Loader2, Sparkles, Users, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getSentLikes, getReceivedLikes, getMatches, cancelLike } from "../services/likeService";
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

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sentData, receivedData, matchesData] = await Promise.all([
        getSentLikes(),
        getReceivedLikes(),
        getMatches(),
      ]);

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
    if (!window.confirm('좋아요를 취소하시겠습니까?')) return;

    try {
      await cancelLike(likeId);
      setSentLikes(sentLikes.filter(like => like.like_id !== likeId));
    } catch (err: any) {
      console.error('좋아요 취소 실패:', err);
      alert(err.message || '좋아요 취소에 실패했습니다.');
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('runmate_user') || 'null');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
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
                  {matches.map((match) => {
                    const otherUser = match.user1_id === currentUser?.user_id ? match.user2 : match.user1;
                    return (
                      <Card key={match.match_id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex gap-4 p-4">
                            <div className="relative flex-shrink-0">
                              <ImageWithFallback
                                src={otherUser?.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                alt={otherUser?.name || "User"}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                                <Sparkles size={14} />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-medium mb-1">
                                {otherUser?.name}, {otherUser?.age || "?"}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin size={14} className="mr-1" />
                                {otherUser?.location}
                              </div>
                              <p className="text-xs text-gray-500">
                                {new Date(match.created_at).toLocaleDateString('ko-KR')} 매칭됨
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
                              src={like.sender?.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                              alt={like.sender?.name || "User"}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
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
                              src={like.receiver?.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
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
