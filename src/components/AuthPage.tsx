import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mail, Lock, User, MapPin, ArrowLeft } from "lucide-react";

interface AuthPageProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    location: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    if (!loginForm.email || !loginForm.password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // 실제로는 여기서 API 호출
    // 임시로 localStorage에서 사용자 정보 확인
    const savedUser = localStorage.getItem('runmate_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email === loginForm.email) {
        localStorage.setItem('runmate_auth', 'true');
        onLogin(user);
        return;
      }
    }

    alert("등록되지 않은 사용자입니다. 회원가입을 해주세요.");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.age || !signupForm.location) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (signupForm.password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    // 사용자 정보 저장
    const userData = {
      name: signupForm.name,
      email: signupForm.email,
      age: parseInt(signupForm.age),
      location: signupForm.location,
      joinDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }),
      bio: "건강한 라이프스타일을 추구하는 러닝 애호가입니다. 함께 뛸 메이트들과 즐거운 러닝을 하고 있어요! 💪",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      preferences: {
        pace: "5:30-6:00/km",
        distance: "3-8km",
        time: "저녁 (18:00-20:00)",
        frequency: "주 3-4회"
      },
      tags: ["새벽러닝", "초급자환영", "건강관리"]
    };

    localStorage.setItem('runmate_user', JSON.stringify(userData));
    localStorage.setItem('runmate_auth', 'true');
    onLogin(userData);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-4">
            <span className="text-white">RM</span>
          </div>
          <h1 className="text-4xl mb-2">RunMate</h1>
          <p className="text-gray-600">함께 뛰는 즐거움</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">이메일</Label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">비밀번호</Label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-gray-800">
                  로그인
                </Button>

                <div className="text-center">
                  <button type="button" className="text-sm text-gray-600 hover:text-gray-900">
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">이름</Label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="홍길동"
                      className="pl-10"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">이메일</Label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="signup-age">나이</Label>
                    <Input
                      id="signup-age"
                      type="number"
                      placeholder="28"
                      value={signupForm.age}
                      onChange={(e) => setSignupForm({ ...signupForm, age: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-location">지역</Label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="signup-location"
                        type="text"
                        placeholder="서울 강남구"
                        className="pl-10"
                        value={signupForm.location}
                        onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-gray-800">
                  회원가입
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  가입하시면 RunMate의 <a href="#" className="text-black hover:underline">이용약관</a> 및 <a href="#" className="text-black hover:underline">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}