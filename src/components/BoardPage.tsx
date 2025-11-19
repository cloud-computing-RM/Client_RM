import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Heart, MessageCircle, Eye, Search, TrendingUp, Clock } from "lucide-react";

interface BoardPageProps {
  onPostClick: (postId: number) => void;
}

export function BoardPage({ onPostClick }: BoardPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const posts = [
    {
      id: 1,
      category: "공지",
      title: "커뮤니티 이용규칙 안내",
      author: "관리자",
      timestamp: "2024.09.29",
      likes: 214,
      comments: 82,
      views: 14650,
      image: null,
    },
    {
      id: 2,
      category: "공지",
      title: "부적절한 게시물 신고 방법 안내",
      author: "관리자",
      timestamp: "2024.09.22",
      likes: 81,
      comments: 45,
      views: 7433,
      image: null,
    },
    {
      id: 3,
      title: "여의도 한강공원 야간 러닝 코스 완전 강추!",
      author: "서울러너",
      authorInfo: "야경 보면서 뛰니까 힐링됩니다 ㅎㅎ",
      timestamp: "1시간전",
      likes: 388,
      comments: 67,
      views: 3262,
      image: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=120&h=120&fit=crop",
    },
    {
      id: 4,
      title: "한강 뚝섬유원지 러닝 코스 추천!",
      author: "러닝매니아",
      authorInfo: "평탄한 길이라 초보자에게 딱이에요",
      timestamp: "2시간전",
      likes: 156,
      comments: 34,
      views: 2145,
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=120&h=120&fit=crop",
    },
    {
      id: 5,
      title: "초보자를 위한 5km 완주 팁",
      author: "러닝코치김",
      authorInfo: "3개월만에 5km 완주한 후기",
      timestamp: "3시간전",
      likes: 234,
      comments: 89,
      views: 5621,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop",
    },
    {
      id: 6,
      title: "남산 둘레길 러닝 후기 (난이도: 중상)",
      author: "산좋아",
      authorInfo: "경사가 있어서 체력 향상에 좋아요",
      timestamp: "5시간전",
      likes: 92,
      comments: 23,
      views: 1834,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=120&h=120&fit=crop",
    },
    {
      id: 7,
      title: "러닝화 추천해주세요 (10만원 이하)",
      author: "러닝시작",
      authorInfo: "초보자인데 어떤 신발이 좋을까요?",
      timestamp: "1일전",
      likes: 45,
      comments: 78,
      views: 2456,
      image: null,
    },
    {
      id: 8,
      title: "새벽 러닝 vs 저녁 러닝 뭐가 좋을까요?",
      author: "고민중",
      authorInfo: "각각의 장단점이 궁금합니다",
      timestamp: "1일전",
      likes: 67,
      comments: 112,
      views: 3892,
      image: null,
    },
  ];

  const popularPosts = posts.slice(2, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl mb-2">게시판</h1>
          <p className="text-gray-600">러닝 팁과 경험을 공유하세요</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => onPostClick(post.id)}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    {post.image && (
                      <div className="flex-shrink-0">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Category Badge */}
                      {post.category && (
                        <Badge 
                          className="mb-3 bg-black text-white border-0"
                        >
                          {post.category}
                        </Badge>
                      )}
                      
                      {/* Title */}
                      <h3 className="mb-2 text-xl line-clamp-1 group-hover:text-gray-600 transition-colors">{post.title}</h3>
                      
                      {/* Author Info */}
                      {post.authorInfo && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{post.authorInfo}</p>
                      )}
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.timestamp}
                        </span>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Heart size={16} />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MessageCircle size={16} />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Eye size={16} />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 pt-6">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="mb-4">검색</h3>
              <div className="space-y-3">
                <Select value={searchFilter} onValueChange={setSearchFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">제목</SelectItem>
                    <SelectItem value="titleContent">제목 + 내용</SelectItem>
                    <SelectItem value="author">글쓴이</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="검색어 입력"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    <Search size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} />
                <h3>인기 게시물</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <div 
                    key={post.id}
                    className="cursor-pointer group"
                    onClick={() => onPostClick(post.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl font-bold text-gray-200 group-hover:text-black transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Heart size={12} />
                          <span>{post.likes}</span>
                          <MessageCircle size={12} />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                    {index < popularPosts.length - 1 && (
                      <div className="border-t border-gray-100 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-black text-white rounded-2xl p-6">
              <h3 className="mb-4">커뮤니티 통계</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">전체 게시물</span>
                  <span className="text-xl">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">오늘 작성</span>
                  <span className="text-xl">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">활성 회원</span>
                  <span className="text-xl">328</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
