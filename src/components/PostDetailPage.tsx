import { ArrowLeft, Heart, MessageCircle, Eye, Share2, Loader2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getPost, getComments, createComment, likePost, unlikePost, deletePost } from "../services/postService";
import type { Post, Comment } from "../types";

interface PostDetailPageProps {
  postId: number;
  onBack: () => void;
}

export function PostDetailPage({ postId, onBack }: PostDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 현재 로그인한 사용자 정보
  const currentUser = JSON.parse(localStorage.getItem('runmate_user') || 'null');

  // 스와이프 감지 - 최소 이동 거리
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    // 오른쪽으로만 드래그 가능 (뒤로가기)
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > minSwipeDistance) {
      onBack();
    }
    setDragOffset(0);
  };

  // 마우스 드래그 지원
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - touchStart;
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleMouseUp = () => {
    if (dragOffset > minSwipeDistance) {
      onBack();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  // 게시글 및 댓글 데이터 로드
  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [postData, commentsData] = await Promise.all([
        getPost(postId),
        getComments(postId),
      ]);

      setPost(postData);
      setComments(commentsData);
      // TODO: 좋아요 상태는 별도 API로 확인 필요 (현재는 false로 초기화)
      setIsLiked(false);
    } catch (err: any) {
      setError(err.message || '게시글을 불러오는데 실패했습니다.');
      console.error('게시글 로드 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!post || likeLoading) return;

    try {
      setLikeLoading(true);

      if (isLiked) {
        await unlikePost(postId);
        setPost({ ...post, like_count: post.like_count - 1 });
        setIsLiked(false);
      } else {
        await likePost(postId);
        setPost({ ...post, like_count: post.like_count + 1 });
        setIsLiked(true);
      }
    } catch (err: any) {
      console.error('좋아요 에러:', err);
      alert(err.message || '좋아요 처리에 실패했습니다.');
    } finally {
      setLikeLoading(false);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!comment.trim() || commentLoading) return;

    try {
      setCommentLoading(true);

      const newComment = await createComment(postId, { content: comment.trim() });
      setComments([...comments, newComment]);
      setComment("");

      // 댓글 수 업데이트
      if (post) {
        setPost({ ...post, comment_count: post.comment_count + 1 });
      }
    } catch (err: any) {
      console.error('댓글 작성 에러:', err);
      alert(err.message || '댓글 작성에 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  // 수정 모드 시작
  const handleEditStart = () => {
    if (!post) return;
    setEditTitle(post.title || "");
    setEditContent(post.content);
    setIsEditing(true);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  // 게시글 수정
  const handleEditSubmit = async () => {
    if (!editContent.trim() || editLoading || !post) return;

    try {
      setEditLoading(true);

      const { updatePost } = await import("../services/postService");
      const updatedPost = await updatePost(postId, {
        title: editTitle.trim() || undefined,
        content: editContent.trim(),
      });

      setPost(updatedPost);
      setIsEditing(false);
      setEditTitle("");
      setEditContent("");
      alert('게시글이 수정되었습니다.');
    } catch (err: any) {
      console.error('게시글 수정 에러:', err);
      alert(err.message || '게시글 수정에 실패했습니다.');
    } finally {
      setEditLoading(false);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    try {
      await deletePost(postId);
      alert('게시글이 삭제되었습니다.');
      onBack();
    } catch (err: any) {
      console.error('게시글 삭제 에러:', err);
      alert(err.message || '게시글 삭제에 실패했습니다.');
    }
  };

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

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  // 에러 상태
  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h2 className="flex-1">게시글</h2>
        </div>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
            <Button onClick={onBack} className="bg-black hover:bg-gray-800 text-white">
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white pb-20 transition-transform"
      style={{
        transform: `translateX(${dragOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95">
          <ArrowLeft size={24} />
        </button>
        <h2 className="flex-1">게시글</h2>
        {currentUser && post && currentUser.user_id === post.user_id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditStart}>
                <Edit2 size={16} className="mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 size={16} className="mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {(!currentUser || !post || currentUser.user_id !== post.user_id) && (
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Share2 size={20} />
          </button>
        )}
      </div>

      {/* Swipe Indicator */}
      {dragOffset > 10 && (
        <div
          className="fixed left-4 top-1/2 -translate-y-1/2 text-blue-600 z-50"
          style={{ opacity: Math.min(dragOffset / 100, 1) }}
        >
          <ArrowLeft size={32} />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-3">
          <Badge className="bg-black text-white border-0">
            {getPostTypeLabel(post.post_type)}
          </Badge>
        </div>

        {/* Title */}
        {post.title && (
          <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <Avatar>
            <AvatarImage src={post.user?.profile_image || ""} />
            <AvatarFallback>{post.user?.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{post.user?.name || "익명"}</p>
            <p className="text-sm text-gray-500">{getRelativeTime(post.created_at)}</p>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                제목 <span className="text-gray-400">(선택사항)</span>
              </label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={200}
                disabled={editLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="내용을 입력하세요"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                disabled={editLoading}
                className="resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleEditCancel}
                variant="outline"
                disabled={editLoading}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={!editContent.trim() || editLoading}
                className="flex-1 bg-black hover:bg-gray-800 text-white"
              >
                {editLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    수정 중...
                  </>
                ) : (
                  "수정하기"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-4 space-y-2">
                {post.images.map((image) => (
                  <div key={image.image_id} className="rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={image.image_url}
                      alt={post.title || '게시글 이미지'}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="mb-6 whitespace-pre-line text-gray-700">
              {post.content}
            </div>
          </>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center gap-6 py-4 border-y border-gray-100">
          <button
            onClick={handleLikeToggle}
            disabled={likeLoading}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'} ${likeLoading ? 'opacity-50' : ''}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{post.like_count}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle size={20} />
            <span>{post.comment_count}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Eye size={20} />
            <span>{post.view_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h3 className="mb-4 font-semibold">댓글 {comments.length}개</h3>

          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">첫 댓글을 작성해보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.comment_id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user?.profile_image || ""} />
                    <AvatarFallback className="text-sm">{comment.user?.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.user?.name || "익명"}</span>
                      <span className="text-xs text-gray-500">{getRelativeTime(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <div className="space-y-2 mb-6">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24"
              disabled={commentLoading}
            />
            <Button
              onClick={handleCommentSubmit}
              disabled={!comment.trim() || commentLoading}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              {commentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  작성 중...
                </>
              ) : (
                "댓글 작성"
              )}
            </Button>
          </div>

          {/* Back to List Button */}
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 border-2"
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
