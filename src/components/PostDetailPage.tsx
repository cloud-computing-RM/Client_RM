import { ArrowLeft, Heart, MessageCircle, Eye, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PostDetailPageProps {
  postId: number;
  onBack: () => void;
}

export function PostDetailPage({ postId, onBack }: PostDetailPageProps) {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Mock data - 실제로는 postId를 기반으로 데이터를 가져와야 함
  const post = {
    id: postId,
    category: postId === 1 ? "공지" : undefined,
    title: postId === 1 
      ? "커뮤니티 이용규칙 안내" 
      : postId === 4
      ? "한강 뚝섬유원지 러닝 코스 추천!"
      : postId === 5
      ? "초보자를 위한 5km 완주 팁"
      : "야간 러닝 시 안전 수칙",
    author: postId === 1 ? "관리자" : "러닝매니아",
    timestamp: "2시간 전",
    likes: 42,
    comments: 15,
    views: 1234,
    content: postId === 1
      ? `안녕하세요, RunMate 운영자입니다.

모두가 즐겁고 안전하게 이용할 수 있는 커뮤니티를 만들기 위해 다음 규칙을 준수해 주시기 바랍니다.

**기본 규칙**
1. 상호 존중: 다른 회원을 존중하고 예의를 지켜주세요
2. 개인정보 보호: 타인의 개인정보를 무단으로 공유하지 마세요
3. 광고 금지: 상업적 광고나 홍보는 금지됩니다
4. 불법 콘텐츠 금지: 저작권 침해, 음란물 등은 엄격히 금지됩니다

**게시물 작성 시**
- 적절한 카테고리를 선택해 주세요
- 명확하고 의미있는 제목을 작성해 주세요
- 러닝과 관련된 유익한 정보를 공유해 주세요

**위반 시 조치**
규칙 위반 시 경고, 게시물 삭제, 계정 정지 등의 조치가 있을 수 있습니다.

감사합니다.`
      : postId === 4
      ? `한강 뚝섬유원지에서 러닝하고 왔는데 정말 좋더라구요!

**코스 정보**
- 거리: 약 5km (왕복)
- 난이도: 초급~중급
- 소요시간: 30~40분

**장점**
1. 평탄한 길이라 초보자도 부담 없어요
2. 야간 조명이 잘 되어있어서 밤에도 안전해요
3. 중간중간 편의점과 화장실이 있어요
4. 자전거 도로와 분리되어 있어서 좋아요

**팁**
- 주말 오후에��� 사람이 많으니 이른 아침이나 평일 저녁 추천
- 음수대가 있지만 개인 물병 챙기는 게 좋아요
- 여름엔 모기가 많으니 모기 스프레이 필수!

같이 뛰실 분들 연락주세요 ㅎㅎ`
      : postId === 5
      ? `저도 3개월 전만 해도 1km도 못 뛰었는데, 이제는 5km를 완주할 수 있게 됐어요!

**제 훈련 방법**
주 1주차: 걷기 5분 + 뛰기 1분 반복 (총 30분)
주 2-3주차: 걷기 3분 + 뛰기 2분 반복 (총 30분)
주 4-5주차: 걷기 2분 + 뛰기 3분 반복 (총 30분)
주 6-8주차: 걷기 1분 + 뛰기 4분 반복 (총 30분)
주 9-12주차: 5km 도전!

**중요한 팁**
1. 절대 무리하지 마세요. 아프면 바로 멈추기!
2. 준비운동과 정리운동은 필수
3. 러닝화는 좋은 걸로 투자하세요
4. 기록보다는 꾸준함이 중요해요

여러분도 할 수 있어요! 화이팅!`
      : `밤에 러닝하시는 분들 많으시죠? 안전 수칙 공유합니다.

**필수 장비**
- 반사 밴드나 야광 조끼
- 헤드랜턴 또는 손전등
- 밝은 색상의 옷

**안전 수칙**
1. 사람이 많은 곳에서 뛰기
2. 이어폰은 한쪽만 착용하기
3. 가족이나 친구에게 러닝 경로 알려주기
4. 어두운 골목길은 피하기

같이 야간 러닝하실 분 구해요!`,
    image: postId === 4 ? "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800&h=400&fit=crop" : null,
  };

  const mockComments = [
    {
      id: 1,
      author: "러닝초보",
      content: "정말 유익한 정보네요! 감사합니다 👍",
      timestamp: "1시간 전",
      likes: 5,
    },
    {
      id: 2,
      author: "달리기왕",
      content: "저도 여기서 자주 뛰는데 정말 좋아요",
      timestamp: "30분 전",
      likes: 3,
    },
  ];

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
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Share2 size={20} />
        </button>
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
        {post.category && (
          <div className="mb-3">
            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm">
              {post.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4">{post.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p>{post.author}</p>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>

        {/* Image */}
        {post.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={post.image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div className="mb-6 whitespace-pre-line text-gray-700">
          {post.content}
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-6 py-4 border-y border-gray-100">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle size={20} />
            <span>{post.comments}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Eye size={20} />
            <span>{post.views}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h3 className="mb-4">댓글 {mockComments.length}개</h3>
          
          <div className="space-y-4 mb-6">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-sm">{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                  <button className="flex items-center gap-1 text-xs text-gray-500">
                    <Heart size={14} />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="space-y-2 mb-6">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24"
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              댓글 작성
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