import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { WebHeader } from "./components/WebHeader";
import { LandingPage } from "./components/LandingPage";
import { HomePage } from "./components/HomePage";
import { ExplorePage } from "./components/ExplorePage";
import { BoardPage } from "./components/BoardPage";
import { RecordsPage } from "./components/RecordsPage";
import { ProfilePage } from "./components/ProfilePage";
import { PostDetailPage } from "./components/PostDetailPage";
import { LikedMatesPage } from "./components/LikedMatesPage";
import { AuthPage } from "./components/AuthPage";
import { SettingsPage } from "./components/SettingsPage";
import { ChatPage } from "./components/ChatPage";
import { ChatRoomPage } from "./components/ChatRoomPage";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showLikedMates, setShowLikedMates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(null);

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    const authStatus = localStorage.getItem('runmate_auth');
    const savedUser = localStorage.getItem('runmate_user');
    
    if (authStatus === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      setShowLanding(false);
    }
  }, []);

  const handleNavigateToAuth = () => {
    setShowLanding(false);
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    setShowAuth(false);
    setShowLanding(true);
  };

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowAuth(false);
    setShowLanding(false);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('runmate_auth');
      setIsAuthenticated(false);
      setUser(null);
      setActiveTab('home');
      setShowLanding(true);
    }
  };

  // 랜딩 페이지 표시
  if (showLanding && !isAuthenticated) {
    return <LandingPage onNavigateToAuth={handleNavigateToAuth} />;
  }

  // 인증 페이지 표시
  if (showAuth && !isAuthenticated) {
    return <AuthPage onLogin={handleLogin} onBack={handleBackToLanding} />;
  }

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setSelectedPostId(null);
    setShowLikedMates(false);
    setShowSettings(false);
    setSelectedChatRoomId(null);
  };

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleBackFromPost = () => {
    setSelectedPostId(null);
  };

  const handleNavigateToLikedMates = () => {
    setShowLikedMates(true);
  };

  const handleBackFromLikedMates = () => {
    setShowLikedMates(false);
  };

  const handleNavigateToSettings = () => {
    setShowSettings(true);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleChatRoomClick = (chatRoomId: number) => {
    setSelectedChatRoomId(chatRoomId);
  };

  const handleBackFromChatRoom = () => {
    setSelectedChatRoomId(null);
  };

  const renderPage = () => {
    // 좋아요한 메이트 전체보기 페이지
    if (activeTab === 'profile' && showLikedMates) {
      return <LikedMatesPage onBack={handleBackFromLikedMates} />;
    }

    // 설정 페이지
    if (activeTab === 'profile' && showSettings) {
      return <SettingsPage onBack={handleBackFromSettings} />;
    }
    
    // 설정 페이지 (직접 접근)
    if (activeTab === 'settings') {
      return <SettingsPage onBack={() => setActiveTab('profile')} />;
    }

    // 게시물 상세 페이지가 선택된 경우
    if (activeTab === 'board' && selectedPostId !== null) {
      return <PostDetailPage postId={selectedPostId} onBack={handleBackFromPost} />;
    }

    // 채팅방이 선택된 경우
    if (activeTab === 'chat' && selectedChatRoomId !== null) {
      return <ChatRoomPage chatRoomId={selectedChatRoomId} onBack={handleBackFromChatRoom} />;
    }

    switch (activeTab) {
      case 'explore':
        return <ExplorePage />;
      case 'chat':
        return <ChatPage onChatRoomClick={handleChatRoomClick} />;
      case 'board':
        return <BoardPage onPostClick={handlePostClick} />;
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'records':
        return <RecordsPage />;
      case 'profile':
        return <ProfilePage onNavigateToLikedMates={handleNavigateToLikedMates} onNavigateToSettings={handleNavigateToSettings} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <WebHeader 
        activeTab={activeTab} 
        onTabChange={handleNavigation}
        user={user}
        onLogout={handleLogout} 
      />
      <div className="pt-16">
        {renderPage()}
      </div>
    </div>
  );
}