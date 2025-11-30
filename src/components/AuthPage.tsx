import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mail, Lock, User, MapPin, ArrowLeft } from "lucide-react";
import { login, register } from "../services/authService";
import { tokenStorage } from "../services/apiClient";
import type { User as UserType } from "../types";

interface AuthPageProps {
  onLogin: (userData: UserType) => void;
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
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!loginForm.email || !loginForm.password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({
        email: loginForm.email,
        password: loginForm.password,
      });

      // 토큰 저장
      tokenStorage.set(response.token);

      // 사용자 정보 저장
      localStorage.setItem('runmate_user', JSON.stringify(response.user));
      localStorage.setItem('runmate_auth', 'true');

      onLogin(response.user);
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.age || !signupForm.location) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (signupForm.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        age: parseInt(signupForm.age),
        location: signupForm.location,
        bio: signupForm.bio,
      });

      // 토큰 저장
      tokenStorage.set(response.token);

      // 사용자 정보 저장
      localStorage.setItem('runmate_user', JSON.stringify(response.user));
      localStorage.setItem('runmate_auth', 'true');

      onLogin(response.user);
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

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

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
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

                <div className="space-y-2">
                  <Label htmlFor="signup-bio">자기소개</Label>
                  <Textarea
                    id="signup-bio"
                    placeholder="간단한 자기소개를 입력해주세요..."
                    value={signupForm.bio}
                    onChange={(e) => setSignupForm({ ...signupForm, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? "가입 중..." : "회원가입"}
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