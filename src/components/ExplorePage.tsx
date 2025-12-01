import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Heart, MapPin, Clock, Users, X, RotateCcw, Zap, Loader2, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { sendLike } from "../services/likeService";
import { getNearbyUsers, updateLocation } from "../services/userService";
import type { NearbyUser } from "../types";

export function ExplorePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [matchNotification, setMatchNotification] = useState<string | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // GPS 위치 가져오기 및 주변 러너 로드
  useEffect(() => {
    requestLocationAndLoadUsers();
  }, []);

  const requestLocationAndLoadUsers = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    // GPS 권한 체크
    if (!navigator.geolocation) {
      setLocationError('GPS를 지원하지 않는 브라우저입니다.');
      setIsLoadingLocation(false);
      return;
    }

    // GPS 위치 가져오기
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        try {
          // 서버에 위치 업데이트
          await updateLocation({ latitude, longitude });
          console.log('위치 업데이트 성공:', { latitude, longitude });

          // 주변 러너 검색
          await loadNearbyUsers(latitude, longitude);
        } catch (error: any) {
          console.error('위치 업데이트 또는 주변 러너 로드 실패:', error);
          setLocationError(error.message || '주변 러너를 불러오는데 실패했습니다.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('GPS 권한 오류:', error);
        let errorMessage = 'GPS 위치를 가져올 수 없습니다.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'GPS 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS 위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS 위치 요청 시간이 초과되었습니다.';
            break;
        }

        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const loadNearbyUsers = async (latitude: number, longitude: number, radius?: number) => {
    setIsLoadingUsers(true);
    try {
      const users = await getNearbyUsers(latitude, longitude, radius);
      setNearbyUsers(users);
      console.log(`주변 러너 ${users.length}명 로드 완료`);
    } catch (error: any) {
      console.error('주변 러너 로드 실패:', error);
      throw error;
    } finally {
      setIsLoadingUsers(false);
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
        while (nextIndex < nearbyUsers.length && likedIds.includes(nearbyUsers[nextIndex].user_id)) {
          nextIndex++;
        }
        setCurrentIndex(nextIndex);
      } catch (error) {
        console.error('Error loading liked profiles:', error);
      }
    }
  }, [nearbyUsers]);

  const currentProfile = nearbyUsers[currentIndex];

  const handleLike = async () => {
    if (!currentProfile || isLiking) return;

    try {
      setIsLiking(true);

      // API로 좋아요 보내기
      const result = await sendLike(currentProfile.user_id);

      // 매칭 알림
      if (result.isMatch) {
        setMatchNotification(`${currentProfile.name}님과 매칭되었습니다! 🎉`);
        setTimeout(() => setMatchNotification(null), 3000);
      }

      // localStorage에도 저장 (백업 및 오프라인 지원)
      const newLikedProfiles = [...likedProfiles, currentProfile.user_id];
      setLikedProfiles(newLikedProfiles);

      try {
        localStorage.setItem('runmate_liked_profiles', JSON.stringify(newLikedProfiles));
        const likedProfilesData = JSON.parse(localStorage.getItem('runmate_liked_profiles_data') || '[]');
        if (!likedProfilesData.find((p: any) => p.user_id === currentProfile.user_id)) {
          likedProfilesData.push(currentProfile);
          localStorage.setItem('runmate_liked_profiles_data', JSON.stringify(likedProfilesData));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }

      nextProfile();
    } catch (error: any) {
      console.error('좋아요 보내기 실패:', error);
      alert(error.message || '좋아요 보내기에 실패했습니다.');
    } finally {
      setIsLiking(false);
    }
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
      } catch (error) {
        console.error('Error resetting profiles:', error);
      }
    }
  };

  // 로딩 상태
  if (isLoadingLocation || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <Loader2 className="w-16 h-16 animate-spin text-[#1e3a8a] mx-auto mb-6" />
          <h2 className="text-3xl mb-3">
            {isLoadingLocation ? 'GPS 위치 확인 중...' : '주변 러너 검색 중...'}
          </h2>
          <p className="text-gray-600">
            {isLoadingLocation
              ? '현재 위치를 확인하고 있습니다.'
              : '가까운 러닝 메이트를 찾고 있습니다.'}
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (locationError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Navigation size={40} className="text-red-500" />
          </div>
          <h2 className="text-3xl mb-3">위치 접근 오류</h2>
          <p className="text-gray-600 mb-8">{locationError}</p>
          <Button
            onClick={requestLocationAndLoadUsers}
            className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
          >
            <RotateCcw size={18} className="mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  // 주변에 러너가 없거나 모든 메이트 확인 완료
  if (nearbyUsers.length === 0 || currentIndex >= nearbyUsers.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {nearbyUsers.length === 0 ? (
              <Users size={40} className="text-gray-400" />
            ) : (
              <Heart size={40} className="text-gray-400" />
            )}
          </div>
          <h2 className="text-3xl mb-3">
            {nearbyUsers.length === 0 ? '주변에 러너가 없습니다' : '모든 메이트를 확인했어요!'}
          </h2>
          <p className="text-gray-600 mb-8">
            {nearbyUsers.length === 0
              ? '현재 위치 주변에 러닝 메이트가 없습니다. 위치를 새로고침하거나 나중에 다시 시도해보세요.'
              : '새로운 러닝 메이트가 곧 추가될 예정입니다.'}
          </p>
          <div className="flex gap-3 justify-center">
            {nearbyUsers.length > 0 && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-gray-300"
              >
                <RotateCcw size={18} className="mr-2" />
                처음부터 다시 보기
              </Button>
            )}
            <Button
              onClick={requestLocationAndLoadUsers}
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
            >
              <Navigation size={18} className="mr-2" />
              위치 새로고침
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
      {/* 매칭 알림 */}
      {matchNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
            <Heart size={20} fill="white" />
            <span className="font-medium">{matchNotification}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl mb-2">둘러보기</h1>
            <p className="text-gray-600">함께 뛸 러닝 메이트를 찾아보세요</p>
          </div>
          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-white"
          >
            <RotateCcw size={18} className="mr-2" />
            초기화
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Card Stack */}
          <div className="relative" style={{ height: '600px' }}>
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Next Card Preview (더 뒤에) */}
              {currentIndex + 2 < nearbyUsers.length && (
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
              {currentIndex + 1 < nearbyUsers.length && (
                <div
                  className="absolute inset-0 bg-white rounded-3xl shadow-md border border-gray-100"
                  style={{
                    transform: 'scale(0.95) translateY(10px)',
                    zIndex: 2,
                    opacity: 0.6,
                  }}
                >
                  <ImageWithFallback
                    src={nearbyUsers[currentIndex + 1].profile_image || ''}
                    alt={nearbyUsers[currentIndex + 1].name}
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
                      src={currentProfile.profile_image || ''}
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
                        <div className="text-lg">
                          {currentProfile.preferred_pace_min && currentProfile.preferred_pace_max
                            ? `${currentProfile.preferred_pace_min}:00-${currentProfile.preferred_pace_max}:00/km`
                            : '미설정'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <Users size={14} className="mr-1" />
                          거리
                        </div>
                        <div className="text-sm">
                          {currentProfile.preferred_distance_min && currentProfile.preferred_distance_max
                            ? `${currentProfile.preferred_distance_min}-${currentProfile.preferred_distance_max}km`
                            : '미설정'}
                        </div>
                      </div>
                    </div>

                    {currentProfile.distance && (
                      <div className="bg-blue-50 rounded-xl p-3 mb-4">
                        <div className="flex items-center text-blue-700 text-xs mb-1">
                          <MapPin size={14} className="mr-1" />
                          거리
                        </div>
                        <div className="text-sm text-blue-900">
                          {currentProfile.distance.toFixed(1)}km 떨어진 위치
                        </div>
                      </div>
                    )}

                    {currentProfile.bio && (
                      <p className="text-gray-700 mb-4 leading-relaxed">{currentProfile.bio}</p>
                    )}

                    {currentProfile.tags && currentProfile.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.tags.map((tag) => (
                          <Badge
                            key={tag.tag_id}
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 border-0"
                          >
                            #{tag.tag_name}
                          </Badge>
                        ))}
                      </div>
                    )}
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
                disabled={isLiking}
                className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={28} className="text-gray-600 hover:text-red-500 transition-colors" />
              </button>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="w-20 h-20 bg-black rounded-full shadow-xl flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart size={32} className="text-white" fill="white" />
              </button>
            </div>

            {/* Progress */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {currentIndex + 1} / {nearbyUsers.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-black h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / nearbyUsers.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
