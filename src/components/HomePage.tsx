import { Button } from "./ui/button";
import { ArrowRight, Users, TrendingUp, Heart, Target } from "lucide-react";
import { FeatureCard } from "./common/FeatureCard";
import { StatCard } from "./common/StatCard";

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      id: 'explore',
      title: '둘러보기',
      description: '함께 뛸 러닝 메이트를 손쉽게 구해보세요',
      icon: <Users size={24} />,
    },
    {
      id: 'board',
      title: '게시판',
      description: '본인에게 맞는 러닝팁을 구해보세요',
      icon: <TrendingUp size={24} />,
    },
    {
      id: 'records',
      title: '기록',
      description: '소중한 러닝 추억을 기록해보세요',
      icon: <Heart size={24} />,
    },
    {
      id: 'profile',
      title: '프로필',
      description: '자신의 스타일을 당당하게 보여주세요',
      icon: <Target size={24} />,
    },
  ];

  const stats = [
    { value: "2,847", label: "러닝 메이트" },
    { value: "15,234", label: "완료된 런" },
    { value: "98,432", label: "총 거리 (km)" },
    { value: "4.8", label: "평균 평점" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#1e3a8a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6">
              함께 뛰는<br />즐거움을 발견하세요
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              RunMate는 러닝을 사랑하는 사람들을 연결합니다.<br />
              혼자가 아닌 함께, 더 멀리 달릴 수 있습니다.
            </p>
            <Button
              onClick={() => onNavigate('explore')}
              size="lg"
              className="bg-white hover:bg-gray-100 text-[#1e3a8a] px-8 h-12"
            >
              메이트 찾기
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">시작해볼까요?</h2>
            <p className="text-gray-600 text-lg">RunMate의 다양한 기능을 둘러보세요</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => onNavigate(feature.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#1e3a8a] text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-6">오늘부터 함께 달리세요</h2>
          <p className="text-blue-100 text-lg mb-10">
            RunMate와 함께라면 러닝이 더 즐겁습니다.
          </p>
          <Button
            onClick={() => onNavigate('explore')}
            size="lg"
            className="bg-white hover:bg-gray-100 text-[#1e3a8a] px-8 h-12"
          >
            시작하기
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
