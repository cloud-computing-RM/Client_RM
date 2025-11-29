import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Heart, MapPin, Clock, Users, X, RotateCcw, Zap, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { getNearbyUsers } from "../services/userService";
import type { NearbyUser } from "../types";

export function ExplorePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const runningProfiles = [
    {
      id: 1,
      name: "김민준",
      age: 28,
      location: "서울 강남구",
      pace: "5:30/km",
      distance: "주 3회, 5-10km",
      bio: "새벽 러닝을 좋아하는 직장인입니다. 함께 뛸 분 환영해요!",
      tags: ["새벽러닝", "강남", "초급자환영"],
      image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "박지연",
      age: 25,
      location: "서울 홍대",
      pace: "6:00/km",
      distance: "주 4회, 3-7km",
      bio: "러닝 초보입니다. 천천히 함께 달리실 분 찾아요 🏃‍♀️",
      tags: ["초보", "홍대", "재미있게"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "이태혁",
      age: 32,
      location: "서울 송파구",
      pace: "4:45/km",
      distance: "주 5회, 10-15km",
      bio: "마라톤 준비 중입니다. 페이스 맞춰 뛸 분 구해요!",
      tags: ["마라톤", "송파", "고급자"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "최수진",
      age: 27,
      location: "서울 마포구",
      pace: "5:45/km",
      distance: "주 3회, 5km",
      bio: "한강 야경 보며 러닝하는 걸 좋아해요 🌃",
      tags: ["야간러닝", "한강", "여의도"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "정현우",
      age: 30,
      location: "서울 용산구",
      pace: "5:00/km",
      distance: "주 4회, 7-12km",
      bio: "주말 장거리 러닝 함께하실 분 찾습니다!",
      tags: ["주말러닝", "장거리", "용산"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "박진수",
      age: 29,
      location: "서울 서초구",
      pace: "5:15/km",
      distance: "주 5회, 8-12km",
      bio: "트레일 러닝 좋아합니다. 산과 자연 속에서 함께 뛰어요! ⛰️",
      tags: ["트레일러닝", "서초", "자연"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 7,
      name: "이찬빈",
      age: 26,
      location: "서울 성동구",
      pace: "5:50/km",
      distance: "주 3회, 4-6km",
      bio: "음악 들으며 가볍게 뛰는 걸 좋아합니다 🎵 성수동 근처 러너 환영!",
      tags: ["음악러닝", "성수", "중급자"],
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 8,
      name: "박규민",
      age: 31,
      location: "서울 영등포구",
      pace: "4:50/km",
      distance: "주 6회, 10-20km",
      bio: "하프/풀 마라톤 준비 중입니다. 고급 러너와 페이스 트레이닝 원합니다!",
      tags: ["풀마라톤", "고급자", "영등포"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 9,
      name: "박제성",
      age: 24,
      location: "서울 광진구",
      pace: "6:15/km",
      distance: "주 2회, 3-5km",
      bio: "러닝 시작한지 얼마 안 됐어요. 초보 러너들과 함께 성장하고 싶습니다! 💪",
      tags: ["초보", "광진", "건대"],
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face",
    },
  ];

  // GPS 위치 가져오고 주변 러너 검색
  const loadNearbyUsers = async () => {
    setIsLoadingLocation(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const users = await getNearbyUsers(latitude, longitude, 5); // 5km 반경
            setNearbyUsers(users);
            setCurrentIndex(0); // 검색 후 첫 번째 프로필부터 시작
          } catch (error) {
            console.error('Failed to fetch nearby users:', error);
            alert('주변 러너를 찾을 수 없습니다. 다시 시도해주세요.');
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('위치 정보를 가져올 수 없습니다. 브라우저 설정에서 위치 권한을 확인해주세요.');
          setIsLoadingLocation(false);
        }
      );
    } else {
      console.error('Geolocation is not supported');
      alert('이 브라우저는 위치 기능을 지원하지 않습니다.');
      setIsLoadingLocation(false);
    }
  };

  // localStorage에서 좋아요한 프로필 불러오기
  useEffect(() => {
    const savedLikes = localStorage.getItem('runmate_liked_profiles');
    if (savedLikes) {
      try {
        const likedIds = JSON.parse(savedLikes);
        setLikedProfiles(likedIds);
        
        // 이미 좋아요한 프로필은 건너뛰기
        let nextIndex = 0;
        while (nextIndex < runningProfiles.length && likedIds.includes(runningProfiles[nextIndex].id)) {
          nextIndex++;
        }
        setCurrentIndex(nextIndex);
      } catch (error) {
        console.error('Error loading liked profiles:', error);
      }
    }
  }, []);

  // nearbyUsers를 목업 데이터와 같은 형식으로 변환
  const transformedNearbyUsers = nearbyUsers.map(user => ({
    id: user.user_id,
    name: user.name,
    age: user.age,
    location: user.location,
    pace: user.preferred_pace_min && user.preferred_pace_max
      ? `${Math.floor((user.preferred_pace_min + user.preferred_pace_max) / 2 / 60)}:${String(Math.floor((user.preferred_pace_min + user.preferred_pace_max) / 2 % 60)).padStart(2, '0')}/km`
      : "5:30/km",
    distance: user.preferred_frequency || "주 3회, 5-10km",
    bio: user.bio || "함께 달릴 러닝 메이트를 찾고 있어요!",
    tags: user.tags?.map(tag => tag.tag_name) || [],
    image: user.profile_image || '',
  }));

  // nearbyUsers가 있으면 사용하고, 없으면 목업 데이터 사용
  const displayProfiles = transformedNearbyUsers.length > 0 ? transformedNearbyUsers : runningProfiles;
  const currentProfile = displayProfiles[currentIndex];

  const handleLike = () => {
    if (!currentProfile) return;
    
    const newLikedProfiles = [...likedProfiles, currentProfile.id];
    setLikedProfiles(newLikedProfiles);
    
    // localStorage에 저장 (전체 프로필 정보도 함께 저장)
    try {
      localStorage.setItem('runmate_liked_profiles', JSON.stringify(newLikedProfiles));
      const likedProfilesData = JSON.parse(localStorage.getItem('runmate_liked_profiles_data') || '[]');
      // 중복 방지: 이미 있는지 체크
      if (!likedProfilesData.find((p: any) => p.id === currentProfile.id)) {
        likedProfilesData.push(currentProfile);
        localStorage.setItem('runmate_liked_profiles_data', JSON.stringify(likedProfilesData));
      }
    } catch (error) {
      console.error('Error saving liked profiles:', error);
    }
    
    nextProfile();
  };

  const handlePass = () => {
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentIndex(prev => prev + 1);
    setDragOffset(0);
  };

  // 드래그 핸들러
  const handleDragStart = (clientX: number) => {
    setDragStart(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // 일정 거리 이상 드래그하면 액션 실행
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset < 0) {
        // 왼쪽으로 드래그 - 패스
        handlePass();
      } else {
        // 오른쪽으로 드래그 - 관심있어요
        handleLike();
      }
    } else {
      setDragOffset(0);
    }
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // 초기화 핸들러
  const handleReset = () => {
    const confirmed = window.confirm('모든 러닝 메이트를 처음부터 다시 볼까요? 관심있는 메이트 목록도 초기화됩니다.');
    if (confirmed) {
      try {
        localStorage.removeItem('runmate_liked_profiles');
        localStorage.removeItem('runmate_liked_profiles_data');
        setLikedProfiles([]);
        setCurrentIndex(0);
        setNearbyUsers([]); // GPS 검색 결과도 초기화
      } catch (error) {
        console.error('Error resetting profiles:', error);
      }
    }
  };

  if (currentIndex >= displayProfiles.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-gray-400" />
          </div>
          <h2 className="text-3xl mb-3">모든 메이트를 확인했어요!</h2>
          <p className="text-gray-600 mb-8">
            {nearbyUsers.length > 0
              ? 'GPS 검색으로 더 많은 러너를 찾아보세요!'
              : '새로운 러닝 메이트가 곧 추가될 예정입니다.'}
          </p>
          <div className="flex gap-3 justify-center">
            {nearbyUsers.length === 0 && (
              <Button
                onClick={loadNearbyUsers}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoadingLocation}
              >
                <Navigation size={18} className="mr-2" />
                GPS 주변 검색
              </Button>
            )}
            <Button
              onClick={handleReset}
              variant="outline"
            >
              <RotateCcw size={18} className="mr-2" />
              처음부터 다시 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const rotation = dragOffset * 0.05;
  const opacity = 1 - Math.abs(dragOffset) / 400;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl mb-2">둘러보기</h1>
            <p className="text-gray-600">
              {nearbyUsers.length > 0
                ? `주변 러너 ${nearbyUsers.length}명 발견`
                : '함께 뛸 러닝 메이트를 찾아보세요'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadNearbyUsers}
              variant="outline"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  검색 중...
                </>
              ) : (
                <>
                  <Navigation size={18} className="mr-2" />
                  GPS 주변 검색
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-white"
            >
              <RotateCcw size={18} className="mr-2" />
              초기화
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Card Stack */}
          <div className="relative" style={{ height: '600px' }}>
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Next Card Preview (더 뒤에) */}
              {currentIndex + 2 < displayProfiles.length && (
                <div
                  className="absolute inset-0 bg-white rounded-3xl shadow-sm border border-gray-100"
                  style={{
                    transform: 'scale(0.90) translateY(20px)',
                    zIndex: 1,
                    opacity: 0.3,
                  }}
                />
              )}

              {/* Next Card Preview */}
              {currentIndex + 1 < displayProfiles.length && (
                <div
                  className="absolute inset-0 bg-white rounded-3xl shadow-md border border-gray-100"
                  style={{
                    transform: 'scale(0.95) translateY(10px)',
                    zIndex: 2,
                    opacity: 0.6,
                  }}
                >
                  <ImageWithFallback
                    src={displayProfiles[currentIndex + 1].image}
                    alt={displayProfiles[currentIndex + 1].name}
                    className="w-full h-2/3 object-cover rounded-t-3xl"
                  />
                </div>
              )}

              {/* Current Card */}
              <div
                ref={cardRef}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: opacity,
                  zIndex: 3,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Image */}
                  <div className="relative h-2/3">
                    <ImageWithFallback
                      src={currentProfile.image}
                      alt={currentProfile.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Swipe Indicators */}
                    {dragOffset < -50 && (
                      <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center transition-opacity">
                        <div className="bg-white/95 rounded-full p-6 shadow-xl">
                          <X size={56} className="text-red-500" strokeWidth={2.5} />
                        </div>
                      </div>
                    )}
                    {dragOffset > 50 && (
                      <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center transition-opacity">
                        <div className="bg-white/95 rounded-full p-6 shadow-xl">
                          <Heart size={56} className="text-green-500" fill="currentColor" strokeWidth={2.5} />
                        </div>
                      </div>
                    )}

                    {/* Name Tag on Image */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-white text-3xl mb-1">{currentProfile.name}, {currentProfile.age}</h2>
                      <div className="flex items-center text-white/90">
                        <MapPin size={16} className="mr-1.5" />
                        <span className="text-sm">{currentProfile.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info Section */}
                  <div className="p-6 h-1/3 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <Zap size={14} className="mr-1" />
                          페이스
                        </div>
                        <div className="text-lg">{currentProfile.pace}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <Users size={14} className="mr-1" />
                          활동량
                        </div>
                        <div className="text-sm">{currentProfile.distance}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{currentProfile.bio}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.tags.map((tag, index) => (
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
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl mb-4">어떻게 작동하나요?</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <X size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="mb-1">왼쪽으로 스와이프</h4>
                    <p className="text-sm text-gray-600">관심 없으면 다음 메이트로 넘어갑니다</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h4 className="mb-1">오른쪽으로 스와이프</h4>
                    <p className="text-sm text-gray-600">관심 있는 메이트는 저장됩니다</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handlePass}
                className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all active:scale-95"
              >
                <X size={28} className="text-gray-600 hover:text-red-500 transition-colors" />
              </button>
              <button
                onClick={handleLike}
                className="w-20 h-20 bg-black rounded-full shadow-xl flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95"
              >
                <Heart size={32} className="text-white" fill="white" />
              </button>
            </div>

            {/* Progress */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {currentIndex + 1} / {displayProfiles.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-black h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / displayProfiles.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
