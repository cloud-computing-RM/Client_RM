import { Button } from "./ui/button";
import { Heart, Users, TrendingUp, Target, ArrowRight } from "lucide-react";
import { FeatureCard } from "./common/FeatureCard";
import { StatCard } from "./common/StatCard";

interface LandingPageProps {
  onNavigateToAuth: () => void;
}

export function LandingPage({ onNavigateToAuth }: LandingPageProps) {
  const features = [
    {
      icon: <Users size={24} />,
      title: "러닝 메이트 찾기",
      description: "나와 비슷한 페이스, 지역, 시간대의 러닝 파트너를 찾아보세요"
    },
    {
      icon: <TrendingUp size={24} />,
      title: "기록 관리",
      description: "런닝 기록을 쉽게 추가하고 관리하며 성장을 확인하세요"
    },
    {
      icon: <Heart size={24} />,
      title: "커뮤니티",
      description: "러닝 팁과 경험을 공유하고 함께 성장하는 커뮤니티"
    },
    {
      icon: <Target size={24} />,
      title: "목표 달성",
      description: "혼자가 아닌 함께 달성하는 러닝 목표"
    }
  ];

  const stats = [
    { value: "2,847", label: "러닝 메이트" },
    { value: "15,234", label: "완료된 런" },
    { value: "98,432", label: "총 거리 (km)" },
    { value: "4.8", label: "평균 평점" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">RM</span>
              </div>
              <span className="text-xl">RunMate</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-[#1e3a8a] transition-colors">기능</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-[#1e3a8a] transition-colors">사용방법</a>
              <a href="#stats" className="text-gray-600 hover:text-[#1e3a8a] transition-colors">통계</a>
            </nav>
            <Button 
              onClick={onNavigateToAuth}
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
            >
              시작하기
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6">
              함께 뛰는<br />즐거움을 발견하세요
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              RunMate는 러닝을 사랑하는 사람들을 연결합니다.<br />
              혼자가 아닌 함께, 더 멀리 달릴 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onNavigateToAuth}
                size="lg"
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 h-12"
              >
                무료로 시작하기
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-gray-300 hover:bg-gray-50 px-8 h-12"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                더 알아보기
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">RunMate의 주요 기능</h2>
            <p className="text-gray-600 text-lg">러닝을 더 즐겁게 만드는 모든 것</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">간단한 3단계</h2>
            <p className="text-gray-600 text-lg">누구나 쉽게 시작할 수 있습니다</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl mb-3">프로필 생성</h3>
              <p className="text-gray-600">러닝 선호도와 목표를 설정하세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl mb-3">메이트 찾기</h3>
              <p className="text-gray-600">나와 맞는 러닝 파트너를 탐색하세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl mb-3">함께 달리기</h3>
              <p className="text-gray-600">메이트와 함께 목표를 달성하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6">오늘부터 함께 달리세요</h2>
          <p className="text-gray-400 text-lg mb-10">
            RunMate와 함께라면 러닝이 더 즐겁습니다.<br />
            지금 바로 무료로 시작해보세요.
          </p>
          <Button 
            onClick={onNavigateToAuth}
            size="lg"
            className="bg-white hover:bg-gray-100 text-black px-8 h-12"
          >
            무료로 시작하기
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">RM</span>
                </div>
                <span className="text-xl">RunMate</span>
              </div>
              <p className="text-sm text-gray-600">함께 뛰는 즐거움</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm">제품</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">기능</a></li>
                <li><a href="#" className="hover:text-black">가격</a></li>
                <li><a href="#" className="hover:text-black">업데이트</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm">회사</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">소개</a></li>
                <li><a href="#" className="hover:text-black">블로그</a></li>
                <li><a href="#" className="hover:text-black">채용</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm">지원</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">문의</a></li>
                <li><a href="#" className="hover:text-black">도움말</a></li>
                <li><a href="#" className="hover:text-black">커뮤니티</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2024 RunMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}