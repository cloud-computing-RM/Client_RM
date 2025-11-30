import { useState, useEffect } from "react";
import { ArrowLeft, Award, Loader2, Trophy, Lock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getAllAchievements, getUserAchievements, type Achievement, type UserAchievement } from "../services/achievementService";

interface AchievementsPageProps {
  onBack: () => void;
}

export function AchievementsPage({ onBack }: AchievementsPageProps) {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const currentUser = JSON.parse(localStorage.getItem('runmate_user') || 'null');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const [allData, userData] = await Promise.all([
        getAllAchievements(),
        currentUser?.user_id ? getUserAchievements(currentUser.user_id) : Promise.resolve([]),
      ]);

      setAllAchievements(allData);
      setUserAchievements(userData);
    } catch (err: any) {
      console.error('업적 로드 실패:', err);
      setError(err.message || '업적 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 아이콘 매핑 함수
  const getAchievementIcon = (conditionType: string): string => {
    const iconMap: Record<string, string> = {
      'run_distance': '🎯',
      'run_count': '🏃‍♂️',
      'match_count': '👥',
      'streak_days': '🔥',
      'first_run': '⭐',
      'speed': '⚡',
      'consistency': '📅',
    };
    return iconMap[conditionType] || '🏆';
  };

  // 색상 매핑 함수
  const getAchievementColor = (index: number, isAchieved: boolean): string => {
    if (!isAchieved) {
      return 'bg-gray-100 text-gray-400';
    }
    const colors = [
      'bg-blue-50 text-blue-600',
      'bg-green-50 text-green-600',
      'bg-purple-50 text-purple-600',
      'bg-orange-50 text-orange-600',
      'bg-pink-50 text-pink-600',
      'bg-yellow-50 text-yellow-600',
    ];
    return colors[index % colors.length];
  };

  // 사용자가 특정 업적을 달성했는지 확인
  const isAchieved = (achievementId: number): UserAchievement | undefined => {
    return userAchievements.find(ua => ua.achievement_id === achievementId);
  };

  // 달성한 업적만 필터링
  const achievedList = allAchievements.filter(achievement =>
    isAchieved(achievement.achievement_id)
  );

  // 미달성 업적만 필터링
  const notAchievedList = allAchievements.filter(achievement =>
    !isAchieved(achievement.achievement_id)
  );

  const renderAchievementCard = (achievement: Achievement, index: number) => {
    const userAchievement = isAchieved(achievement.achievement_id);
    const achieved = !!userAchievement;

    return (
      <Card key={achievement.achievement_id} className="overflow-hidden">
        <CardContent className="p-0">
          <div className={`p-6 ${getAchievementColor(index, achieved)}`}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/50 rounded-xl flex items-center justify-center text-3xl">
                  {achieved ? (
                    achievement.icon || getAchievementIcon(achievement.condition_type)
                  ) : (
                    <Lock size={24} />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium mb-1">{achievement.name}</h3>
                <p className="text-sm opacity-80 mb-2">{achievement.description}</p>

                <div className="flex items-center gap-3 text-xs">
                  {achieved && userAchievement ? (
                    <>
                      <span className="flex items-center gap-1">
                        <Trophy size={12} />
                        {new Date(userAchievement.achieved_at).toLocaleDateString('ko-KR')} 달성
                      </span>
                      {achievement.reward_points && (
                        <span className="px-2 py-0.5 bg-white/30 rounded-full">
                          +{achievement.reward_points}pt
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Lock size={12} />
                      미달성
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl">업적</h2>
          <p className="text-xs text-gray-600">
            {userAchievements.length} / {allAchievements.length} 달성
          </p>
        </div>
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
              onClick={loadAchievements}
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
              <TabsTrigger value="all">
                전체
                <span className="ml-2 text-xs text-gray-500">
                  {allAchievements.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="achieved">
                달성
                <span className="ml-2 text-xs text-gray-500">
                  {achievedList.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="not-achieved">
                미달성
                <span className="ml-2 text-xs text-gray-500">
                  {notAchievedList.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* 전체 탭 */}
            <TabsContent value="all">
              {allAchievements.length === 0 ? (
                <div className="text-center py-12">
                  <Award size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl mb-2">등록된 업적이 없습니다</h3>
                  <p className="text-gray-600">곧 다양한 업적이 추가될 예정입니다!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allAchievements.map((achievement, index) =>
                    renderAchievementCard(achievement, index)
                  )}
                </div>
              )}
            </TabsContent>

            {/* 달성 탭 */}
            <TabsContent value="achieved">
              {achievedList.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl mb-2">아직 달성한 업적이 없어요</h3>
                  <p className="text-gray-600">러닝을 시작하고 업적을 달성해보세요!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {achievedList.map((achievement, index) =>
                    renderAchievementCard(achievement, index)
                  )}
                </div>
              )}
            </TabsContent>

            {/* 미달성 탭 */}
            <TabsContent value="not-achieved">
              {notAchievedList.length === 0 ? (
                <div className="text-center py-12">
                  <Award size={64} className="mx-auto text-green-300 mb-4" />
                  <h3 className="text-xl mb-2">모든 업적을 달성했습니다!</h3>
                  <p className="text-gray-600">축하합니다! 🎉</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notAchievedList.map((achievement, index) =>
                    renderAchievementCard(achievement, index)
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
