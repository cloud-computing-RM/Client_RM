import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User, Settings, LogOut, Home, Compass, MessageSquare, Activity, MessagesSquare } from "lucide-react";

interface WebHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

export function WebHeader({ activeTab, onTabChange, user, onLogout }: WebHeaderProps) {
  const navItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'explore', label: '둘러보기', icon: Compass },
    { id: 'board', label: '게시판', icon: MessageSquare },
    { id: 'chat', label: '메시지', icon: MessagesSquare },
    { id: 'records', label: '기록', icon: Activity },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center group-hover:bg-[#1e40af] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 2L3 11L4 12L6 10V20H10V14H14V20H18V10L20 12L21 11L13.5 2Z" fill="white"/>
                <circle cx="17" cy="7" r="2" fill="white"/>
              </svg>
            </div>
            <span className="text-2xl tracking-tight hidden sm:block">RunMate</span>
          </button>

          {/* Navigation - 동일한 간격 */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-[#1e3a8a] text-white' 
                      : 'text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="hidden lg:block text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-gray-50 rounded-2xl p-2 pr-4 transition-all">
                <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                  <AvatarImage src={user?.profileImage} alt={user?.name} />
                  <AvatarFallback className="bg-[#1e3a8a] text-white">{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm hidden md:block">{user?.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <div className="px-3 py-3 mb-2">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'runner@runmate.com'}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onTabChange('profile')}
                className="py-2.5 cursor-pointer"
              >
                <User size={18} className="mr-3" />
                프로필
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onTabChange('settings')}
                className="py-2.5 cursor-pointer"
              >
                <Settings size={18} className="mr-3" />
                설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onLogout} 
                className="text-red-600 py-2.5 cursor-pointer focus:text-red-600"
              >
                <LogOut size={18} className="mr-3" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
