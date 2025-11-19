import { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { 
  Bell, 
  Lock, 
  Eye, 
  Globe, 
  Moon, 
  LogOut, 
  Trash2,
  ChevronRight,
  Shield,
  Mail
} from "lucide-react";

interface SettingsPageProps {
  onBack?: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [notifications, setNotifications] = useState({
    newMatch: true,
    newMessage: true,
    runReminder: false,
    weeklyReport: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showLocation: true,
    showStats: true,
  });

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // 로그아웃 로직
      alert('로그아웃 되었습니다');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // 계정 삭제 로직
      alert('계정이 삭제되었습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl mb-2">설정</h1>
          <p className="text-gray-600">앱 설정 및 계정 관리</p>
        </div>

        <div className="space-y-6">
          {/* 알림 설정 */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Bell size={20} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl">알림 설정</h2>
                  <p className="text-sm text-gray-600">받고 싶은 알림을 선택하세요</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-match">새로운 매칭</Label>
                  <p className="text-sm text-gray-500">새로운 러닝 메이트가 매칭되면 알림을 받습니다</p>
                </div>
                <Switch
                  id="new-match"
                  checked={notifications.newMatch}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newMatch: checked }))
                  }
                />
              </div>
              <div className="border-t border-gray-100 pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-message">새 메시지</Label>
                  <p className="text-sm text-gray-500">새로운 메시지를 받으면 알림을 받습니다</p>
                </div>
                <Switch
                  id="new-message"
                  checked={notifications.newMessage}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newMessage: checked }))
                  }
                />
              </div>
              <div className="border-t border-gray-100 pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="run-reminder">러닝 리마인더</Label>
                  <p className="text-sm text-gray-500">정기적으로 러닝 알림을 받습니다</p>
                </div>
                <Switch
                  id="run-reminder"
                  checked={notifications.runReminder}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, runReminder: checked }))
                  }
                />
              </div>
              <div className="border-t border-gray-100 pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-report">주간 리포트</Label>
                  <p className="text-sm text-gray-500">매주 러닝 통계 리포트를 받습니다</p>
                </div>
                <Switch
                  id="weekly-report"
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weeklyReport: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* 개인정보 설정 */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Eye size={20} className="text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl">개인정보 설정</h2>
                  <p className="text-sm text-gray-600">프로필 공개 범위를 설정하세요</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visible">프로필 공개</Label>
                  <p className="text-sm text-gray-500">다른 사용자에게 내 프로필을 공개합니다</p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, profileVisible: checked }))
                  }
                />
              </div>
              <div className="border-t border-gray-100 pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-location">위치 정보 공개</Label>
                  <p className="text-sm text-gray-500">내 위치 정보를 다른 사용자에게 보여줍니다</p>
                </div>
                <Switch
                  id="show-location"
                  checked={privacy.showLocation}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, showLocation: checked }))
                  }
                />
              </div>
              <div className="border-t border-gray-100 pt-4" />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-stats">통계 공개</Label>
                  <p className="text-sm text-gray-500">내 러닝 통계를 다른 사용자에게 보여줍니다</p>
                </div>
                <Switch
                  id="show-stats"
                  checked={privacy.showStats}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, showStats: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* 계정 설정 */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl">계정 설정</h2>
                  <p className="text-sm text-gray-600">계정 보안 및 정보 관리</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-600" />
                  <div>
                    <div>이메일 변경</div>
                    <p className="text-sm text-gray-500">runner@runmate.com</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-600" />
                  <div>
                    <div>비밀번호 변경</div>
                    <p className="text-sm text-gray-500">마지막 변경: 2024년 1월</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* 앱 설정 */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Globe size={20} className="text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl">앱 설정</h2>
                  <p className="text-sm text-gray-600">언어 및 테마 설정</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-gray-600" />
                  <div>
                    <div>언어</div>
                    <p className="text-sm text-gray-500">한국어</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-gray-600" />
                  <div>
                    <div>테마</div>
                    <p className="text-sm text-gray-500">라이트 모드</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* 위험 구역 */}
          <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
            <div className="p-6 border-b border-red-100">
              <h2 className="text-xl text-red-600">위험 구역</h2>
              <p className="text-sm text-gray-600">신중하게 결정해주세요</p>
            </div>
            <div className="p-6 space-y-3">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start text-gray-700 hover:bg-gray-50 h-14"
              >
                <LogOut size={20} className="mr-3" />
                로그아웃
              </Button>
              
              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 h-14"
              >
                <Trash2 size={20} className="mr-3" />
                계정 삭제
              </Button>
            </div>
          </div>

          {/* 앱 정보 */}
          <div className="text-center text-sm text-gray-500 py-6">
            <p>RunMate v1.0.0</p>
            <p className="mt-1">© 2024 RunMate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}