import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ProfileEditModal } from "./ProfileEditModal";
import { Edit, MapPin, Calendar, Heart, Target, Zap, TrendingUp, Award, Settings, Loader2 } from "lucide-react";
import { getUserAchievements, type UserAchievement } from "../services/achievementService";

interface ProfilePageProps {
  onNavigateToLikedMates?: () => void;
  onNavigateToSettings?: () => void;
}

export function ProfilePage({ onNavigateToLikedMates, onNavigateToSettings }: ProfilePageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('runmate_user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return {
      name: "김러너",
      age: 28,
      location: "서울 강남구",
      joinDate: "2024년 1월",
      bio: "건강한 라이프스타일을 추구하는 러닝 애호가입니다. 함께 뛸 메이트들과 즐거운 러닝을 하고 있어요! 💪",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      preferences: {
        pace: "5:30-6:00/km",
        distance: "3-8km",
        time: "저녁 (18:00-20:00)",
        frequency: "주 3-4회"
      },
      tags: ["새벽러닝", "강남", "초급자환영", "건강관리"]
    };
  });

  const stats = {
    totalRuns: 47,
    totalDistance: 234.5,
    avgPace: "5:42/km",
    connections: 12
  };

  // 아이콘 및 색상 매핑 함수
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

  const getAchievementColor = (index: number): string => {
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

  // localStorage에서 좋아요한 프로필 불러오기 & 업적 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem('runmate_liked_profiles_data');
    if (savedData) {
      try {
        const profiles = JSON.parse(savedData);
        setLikedProfiles(profiles);
      } catch (error) {
        console.error('Error loading liked profiles:', error);
      }
    }

    // 업적 데이터 불러오기
    const loadAchievements = async () => {
      if (!user?.user_id) return;

      try {
        setAchievementsLoading(true);
        const achievements = await getUserAchievements(user.user_id);
        setUserAchievements(achievements);
      } catch (error: any) {
        console.error('업적 로드 실패:', error);
        // 에러가 나도 UI는 계속 표시
      } finally {
        setAchievementsLoading(false);
      }
    };

    loadAchievements();
  }, [user?.user_id]);

  const handleSaveProfile = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('runmate_user', JSON.stringify(updatedUser));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl mb-2">프로필</h1>
          <p className="text-gray-600">나의 러닝 스타일과 활동을 관리하세요</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
              {/* Profile Header */}
              <div className="p-6 text-center border-b border-gray-100">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="relative group mx-auto block mb-4"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-gray-100">
                    <ImageWithFallback
                      src={user.profile_image || user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit size={24} className="text-white" />
                  </div>
                </button>
                
                <h2 className="text-2xl mb-1">{user.name}, {user.age}</h2>
                <div className="flex items-center justify-center text-gray-600 text-sm mb-4">
                  <MapPin size={14} className="mr-1" />
                  {user.location}
                </div>
                
                <Button 
                  onClick={() => setIsEditModalOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Edit size={16} className="mr-2" />
                  프로필 수정
                </Button>
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-sm text-gray-500 mb-2">소개</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Tags */}
              <div className="p-6">
                <h3 className="text-sm text-gray-500 mb-3">관심사</h3>
                <div className="flex flex-wrap gap-2">
                  {(user.tags || []).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 border-0"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Settings Button */}
              {onNavigateToSettings && (
                <div className="p-6 border-t border-gray-100">
                  <Button
                    onClick={onNavigateToSettings}
                    variant="outline"
                    className="w-full"
                  >
                    <Settings size={16} className="mr-2" />
                    설정
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <TrendingUp size={20} className="text-blue-500" />
                </div>
                <div className="text-2xl mb-1">{stats.totalRuns}</div>
                <div className="text-sm text-gray-600">총 런</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                  <Target size={20} className="text-green-500" />
                </div>
                <div className="text-2xl mb-1">{stats.totalDistance}<span className="text-sm text-gray-500 ml-1">km</span></div>
                <div className="text-sm text-gray-600">총 거리</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                  <Zap size={20} className="text-purple-500" />
                </div>
                <div className="text-2xl mb-1 text-sm">{stats.avgPace}</div>
                <div className="text-sm text-gray-600">평균 페이스</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mb-3">
                  <Heart size={20} className="text-pink-500" />
                </div>
                <div className="text-2xl mb-1">{stats.connections}</div>
                <div className="text-sm text-gray-600">메이트</div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl mb-4">러닝 선호도</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">선호 페이스</div>
                  <div className="text-lg">{user.preferences?.pace || '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">선호 거리</div>
                  <div className="text-lg">{user.preferences?.distance || '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">선호 시간대</div>
                  <div className="text-lg">{user.preferences?.time || '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">활동 빈도</div>
                  <div className="text-lg">{user.preferences?.frequency || '-'}</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} />
                <h3 className="text-xl">업적</h3>
              </div>
              {achievementsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin" size={40} />
                </div>
              ) : userAchievements.length === 0 ? (
                <div className="text-center py-12">
                  <Award size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">아직 획득한 업적이 없습니다</p>
                  <p className="text-sm text-gray-500 mt-2">러닝을 시작하고 업적을 달성해보세요!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {userAchievements.slice(0, 4).map((userAchievement, index) => {
                    const achievement = userAchievement.achievement;
                    if (!achievement) return null;

                    return (
                      <div
                        key={userAchievement.user_achievement_id}
                        className={`${getAchievementColor(index)} rounded-xl p-4`}
                      >
                        <div className="text-3xl mb-2">
                          {achievement.icon || getAchievementIcon(achievement.condition_type)}
                        </div>
                        <div className="mb-1">{achievement.name}</div>
                        <div className="text-sm opacity-80">{achievement.description}</div>
                        <div className="text-xs opacity-60 mt-2">
                          {new Date(userAchievement.achieved_at).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Liked Mates */}
            {likedProfiles.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Heart size={20} />
                    <h3 className="text-xl">관심있는 메이트</h3>
                  </div>
                  {onNavigateToLikedMates && (
                    <Button 
                      onClick={onNavigateToLikedMates}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-black"
                    >
                      전체보기
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {likedProfiles.slice(0, 4).map((profile) => (
                    <div key={profile.id} className="text-center group cursor-pointer">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 border-2 border-gray-100 group-hover:border-gray-300 transition-colors">
                        <ImageWithFallback
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm">{profile.name}</div>
                      <div className="text-xs text-gray-500">{profile.age}세</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <ProfileEditModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}