import { Home, Search, MessageSquare, Activity, User } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'explore', label: '둘러보기' },
    { id: 'board', label: '게시판' },
    { id: 'home', label: '홈' },
    { id: 'records', label: '기록' },
    { id: 'profile', label: '프로필' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-3 min-w-0 ${
                isActive 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}