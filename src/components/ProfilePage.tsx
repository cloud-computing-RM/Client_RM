import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ProfileEditModal } from "./ProfileEditModal";
import { Edit, MapPin, Calendar, Heart, Target, Zap, TrendingUp, Award, Settings } from "lucide-react";
import { getMe } from "../services/authService";
import { getUserTags } from "../services/tagService";
import { getRunningStats, type RunningStats } from "../services/recordService";
import type { User } from "../types";

interface ProfilePageProps {
  onNavigateToLikedMates?: () => void;
  onNavigateToSettings?: () => void;
}

export function ProfilePage({ onNavigateToLikedMates, onNavigateToSettings }: ProfilePageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<RunningStats | null>(null);

  // 사용자 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getMe();
        // 사용자 태그 불러오기
        const userTags = await getUserTags(userData.user_id);
        const userWithTags = { ...userData, tags: userTags };
        setUser(userWithTags);
        localStorage.setItem('runmate_user', JSON.stringify(userWithTags));
      } catch (error) {
        console.error('Failed to load user:', error);
        // 실패 시 localStorage에서 로드
        const savedUser = localStorage.getItem('runmate_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 러닝 통계 로드
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getRunningStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load stats:', error);
        // 실패 시 기본값 설정
        setStats({
          total_runs: 0,
          total_distance: 0,
          total_duration: "00:00:00",
          average_pace: "0:00/km"
        });
      }
    };

    loadStats();
  }, []);

  const achievements = [
    { id: 1, title: "첫 러닝", description: "첫 러닝 기록 달성", icon: "🏃‍♂️", color: "bg-blue-50 text-blue-600" },
    { id: 2, title: "50km 달성", description: "누적 50km 달성", icon: "🎯", color: "bg-green-50 text-green-600" },
    { id: 3, title: "소셜 러너", description: "5명의 메이트와 연결", icon: "👥", color: "bg-purple-50 text-purple-600" },
    { id: 4, title: "꾸준함", description: "7일 연속 러닝", icon: "🔥", color: "bg-orange-50 text-orange-600" },
  ];

  // localStorage에서 좋아요한 프로필 불러오기
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
  }, []);

  const handleSaveProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('runmate_user', JSON.stringify(updatedUser));
  };

  // 페이스를 분:초 형식으로 변환
  const formatPace = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

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
                      src={user.profile_image}
                      alt={user.name}
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
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm text-gray-500 mb-2">소개</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{user.bio || "자기소개가 없습니다."}</p>
              </div>

              {/* Running Preferences */}
              {(user.preferred_time || user.preferred_frequency || user.preferred_pace_min || user.preferred_distance_min) && (
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-sm text-gray-500 mb-3">러닝 선호도</h3>
                  <div className="space-y-2">
                    {user.preferred_pace_min && user.preferred_pace_max && (
                      <div className="text-sm">
                        <span className="text-gray-500">페이스: </span>
                        <span className="text-gray-700">
                          {formatPace(user.preferred_pace_min)} - {formatPace(user.preferred_pace_max)}/km
                        </span>
                      </div>
                    )}
                    {user.preferred_distance_min && user.preferred_distance_max && (
                      <div className="text-sm">
                        <span className="text-gray-500">거리: </span>
                        <span className="text-gray-700">
                          {user.preferred_distance_min} - {user.preferred_distance_max}km
                        </span>
                      </div>
                    )}
                    {user.preferred_time && (
                      <div className="text-sm">
                        <span className="text-gray-500">시간대: </span>
                        <span className="text-gray-700">{user.preferred_time}</span>
                      </div>
                    )}
                    {user.preferred_frequency && (
                      <div className="text-sm">
                        <span className="text-gray-500">빈도: </span>
                        <span className="text-gray-700">{user.preferred_frequency}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {user.tags && user.tags.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm text-gray-500 mb-3">관심사</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.tags.map((tag) => (
                      <Badge
                        key={tag.tag_id}
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 border-0"
                      >
                        #{tag.tag_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
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
                <div className="text-2xl mb-1">{stats?.total_runs ?? 0}</div>
                <div className="text-sm text-gray-600">총 런</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                  <Target size={20} className="text-green-500" />
                </div>
                <div className="text-2xl mb-1">{stats?.total_distance.toFixed(1) ?? '0.0'}<span className="text-sm text-gray-500 ml-1">km</span></div>
                <div className="text-sm text-gray-600">총 거리</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                  <Zap size={20} className="text-purple-500" />
                </div>
                <div className="text-2xl mb-1 text-sm">{stats?.average_pace ?? '0:00/km'}</div>
                <div className="text-sm text-gray-600">평균 페이스</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mb-3">
                  <Heart size={20} className="text-pink-500" />
                </div>
                <div className="text-2xl mb-1">{likedProfiles.length}</div>
                <div className="text-sm text-gray-600">메이트</div>
              </div>
            </div>

            {/* Preferences */}
            {(user.preferred_time || user.preferred_frequency) && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl mb-4">러닝 선호도</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {user.preferred_time && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">선호 시간대</div>
                      <div className="text-lg">{user.preferred_time}</div>
                    </div>
                  )}
                  {user.preferred_frequency && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">활동 빈도</div>
                      <div className="text-lg">{user.preferred_frequency}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} />
                <h3 className="text-xl">업적</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`${achievement.color} rounded-xl p-4`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="mb-1">{achievement.title}</div>
                    <div className="text-sm opacity-80">{achievement.description}</div>
                  </div>
                ))}
              </div>
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