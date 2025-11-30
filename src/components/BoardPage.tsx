import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Heart, MessageCircle, Eye, Search, TrendingUp, Clock, Loader2, PenSquare } from "lucide-react";
import { getPosts } from "../services/postService";
import { CreatePostModal } from "./CreatePostModal";
import type { Post, PostListQuery } from "../types";

interface BoardPageProps {
  onPostClick: (postId: number) => void;
}

export function BoardPage({ onPostClick }: BoardPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [postType, setPostType] = useState<'general' | 'question' | 'review' | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'created_at_desc' | 'popular' | 'liked'>('created_at_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const postsPerPage = 10;

  // 게시글 목록 로드
  useEffect(() => {
    loadPosts();
  }, [currentPage, postType, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const query: PostListQuery = {
        limit: postsPerPage,
        offset: (currentPage - 1) * postsPerPage,
        sort: sortBy,
      };

      if (postType) {
        query.post_type = postType;
      }

      if (searchQuery) {
        query.search = searchQuery;
      }

      const result = await getPosts(query);
      setPosts(result.posts);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || '게시글을 불러오는데 실패했습니다.');
      console.error('게시글 로드 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPosts();
  };

  const totalPages = Math.ceil(total / postsPerPage);
  const popularPosts = posts.slice(0, 5).filter(p => p.like_count > 0).sort((a, b) => b.like_count - a.like_count).slice(0, 3);

  // 상대 시간 표시 함수
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}분전`;
    if (hours < 24) return `${hours}시간전`;
    if (days < 7) return `${days}일전`;
    return date.toLocaleDateString('ko-KR');
  };

  // 게시글 타입 한글 변환
  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'question': return '질문';
      case 'review': return '후기';
      case 'general':
      default: return '일반';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl mb-2">게시판</h1>
            <p className="text-gray-600">러닝 팁과 경험을 공유하세요</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <PenSquare className="mr-2" size={18} />
            글쓰기
          </Button>
        </div>

        {/* 게시글 작성 모달 */}
        <CreatePostModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setCurrentPage(1);
            loadPosts();
          }}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 로딩 상태 */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin" size={40} />
              </div>
            )}

            {/* 에러 상태 */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={loadPosts}
                  className="mt-4 bg-black hover:bg-gray-800 text-white"
                >
                  다시 시도
                </Button>
              </div>
            )}

            {/* 게시글이 없을 때 */}
            {!loading && !error && posts.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">게시글이 없습니다.</p>
              </div>
            )}

            {/* Posts List */}
            {!loading && !error && posts.length > 0 && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.post_id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => onPostClick(post.post_id)}
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      {post.images && post.images.length > 0 && (
                        <div className="flex-shrink-0">
                          <ImageWithFallback
                            src={post.images[0].image_url}
                            alt={post.title || '게시글 이미지'}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Category Badge */}
                        <Badge
                          className="mb-3 bg-black text-white border-0"
                        >
                          {getPostTypeLabel(post.post_type)}
                        </Badge>

                        {/* Title */}
                        {post.title && (
                          <h3 className="mb-2 text-xl line-clamp-1 group-hover:text-gray-600 transition-colors">
                            {post.title}
                          </h3>
                        )}

                        {/* Content Preview */}
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.content}</p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">{post.user?.name}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {getRelativeTime(post.created_at)}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Heart size={16} />
                            <span>{post.like_count}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <MessageCircle size={16} />
                            <span>{post.comment_count}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Eye size={16} />
                            <span>{post.view_count.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
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
                {totalPages > 10 && (
                  <span className="text-gray-500">... {totalPages}</span>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="mb-4">검색 및 필터</h3>
              <div className="space-y-3">
                {/* 게시글 타입 필터 */}
                <Select value={postType || 'all'} onValueChange={(value) => {
                  setPostType(value === 'all' ? undefined : value as any);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="general">일반</SelectItem>
                    <SelectItem value="question">질문</SelectItem>
                    <SelectItem value="review">후기</SelectItem>
                  </SelectContent>
                </Select>

                {/* 정렬 옵션 */}
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value as any);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_desc">최신순</SelectItem>
                    <SelectItem value="popular">조회수순</SelectItem>
                    <SelectItem value="liked">좋아요순</SelectItem>
                  </SelectContent>
                </Select>

                {/* 검색 */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="검색어 입력"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Search size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Popular Posts */}
            {!loading && popularPosts.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} />
                  <h3>인기 게시물</h3>
                </div>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <div
                      key={post.post_id}
                      className="cursor-pointer group"
                      onClick={() => onPostClick(post.post_id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl font-bold text-gray-200 group-hover:text-black transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                            {post.title || post.content}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Heart size={12} />
                            <span>{post.like_count}</span>
                            <MessageCircle size={12} />
                            <span>{post.comment_count}</span>
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
            )}

            {/* Stats */}
            {!loading && (
              <div className="bg-black text-white rounded-2xl p-6">
                <h3 className="mb-4">커뮤니티 통계</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">전체 게시물</span>
                    <span className="text-xl">{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">현재 페이지</span>
                    <span className="text-xl">{currentPage} / {totalPages || 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">페이지당 게시글</span>
                    <span className="text-xl">{posts.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
