# 프론트엔드 개발 작업 분배

## 📊 전체 API 개요
- **총 API 엔드포인트**: 41개
- **도메인**: 8개 (Auth, Users, Tags, Running Records, Likes & Matches, Posts, Achievements, Chat)

---

## 👤 개발자 A 담당 작업

### 🎯 담당 도메인 (총 20개 API)

#### 1. **Auth (인증)** - 난이도: ⭐⭐⭐
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 내 정보 조회

**관련 컴포넌트:**
- `src/components/AuthPage.tsx` (로그인/회원가입 UI)
- `src/App.tsx` (인증 상태 관리)

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/authService.ts`)
- AuthPage 컴포넌트에 실제 API 연동
- JWT 토큰 관리 (localStorage → httpOnly cookie 또는 secure storage)
- 인증 상태 관리 로직 개선
- 에러 핸들링 및 유효성 검사

---

#### 2. **Users (사용자 프로필)** - 난이도: ⭐⭐⭐⭐
- `PUT /api/users/profile` - 프로필 전체 정보 수정
- `PATCH /api/users/profile-image` - 프로필 사진 변경
- `PATCH /api/users/preferences` - 러닝 선호도 수정
- `PATCH /api/users/location` - GPS 위치 업데이트
- `GET /api/users/nearby` - GPS 기반 주변 러너 검색
- `GET /api/users/{user_id}` - 다른 사용자 프로필 조회

**관련 컴포넌트:**
- `src/components/ProfilePage.tsx`
- `src/components/ProfileEditModal.tsx`
- `src/components/profile/BasicInfoForm.tsx`
- `src/components/profile/ProfileImageUpload.tsx`
- `src/components/profile/RunningPreferences.tsx`
- `src/components/ExplorePage.tsx` (주변 러너 검색)

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/userService.ts`)
- 프로필 수정 기능 API 연동
- 이미지 업로드 처리 (multipart/form-data)
- GPS 위치 권한 요청 및 업데이트
- 주변 러너 검색 기능 구현
- 프로필 조회 페이지 구현

---

#### 3. **Tags (태그)** - 난이도: ⭐⭐
- `GET /api/tags` - 모든 태그 목록 조회
- `POST /api/tags/user` - 내 프로필에 태그 추가
- `DELETE /api/tags/user/{tag_id}` - 내 프로필에서 태그 제거
- `GET /api/tags/user/{user_id}` - 특정 사용자의 태그 조회

**관련 컴포넌트:**
- `src/components/profile/TagManager.tsx`

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/tagService.ts`)
- 태그 목록 조회 및 표시
- 태그 추가/삭제 기능 구현
- 태그 자동완성 기능 (선택사항)

---

#### 4. **Running Records (러닝 기록)** - 난이도: ⭐⭐⭐
- `POST /api/running-records` - 러닝 기록 생성
- `GET /api/running-records` - 내 러닝 기록 목록 조회
- `GET /api/running-records/{id}` - 특정 러닝 기록 상세 조회
- `PUT /api/running-records/{id}` - 러닝 기록 수정
- `DELETE /api/running-records/{id}` - 러닝 기록 삭제

**관련 컴포넌트:**
- `src/components/RecordsPage.tsx`
- `src/components/records/RecordCard.tsx`
- `src/components/AddRecordModal.tsx`

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/recordService.ts`)
- 기록 목록 조회 및 표시
- 기록 생성/수정/삭제 기능 구현
- 기록 상세 페이지 구현
- 날짜 필터링 및 정렬 기능

---

### 📦 개발자 A 추가 작업
- **공통 인프라 구축:**
  - API 클라이언트 설정 (`src/services/apiClient.ts`)
  - 인증 토큰 인터셉터
  - 에러 핸들링 유틸리티
  - 타입 정의 (`src/types/`)

---

## 👤 개발자 B 담당 작업

### 🎯 담당 도메인 (총 21개 API)

#### 1. **Likes & Matches (좋아요 및 매칭)** - 난이도: ⭐⭐⭐⭐
- `POST /api/likes` - 좋아요 보내기 (매칭 자동 감지)
- `GET /api/likes/sent` - 보낸 좋아요 목록 조회
- `GET /api/likes/received` - 받은 좋아요 목록 조회
- `GET /api/likes/matches` - 매칭된 사용자 목록 조회
- `DELETE /api/likes/{like_id}` - 좋아요 취소

**관련 컴포넌트:**
- `src/components/ExplorePage.tsx` (좋아요 기능)
- `src/components/LikedMatesPage.tsx`
- 매칭 알림 컴포넌트 (신규 생성 필요)

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/likeService.ts`)
- ExplorePage에 좋아요 기능 연동
- 매칭 감지 및 알림 처리
- 보낸/받은 좋아요 목록 페이지 구현
- 매칭된 사용자 목록 페이지 구현
- 실시간 매칭 알림 (WebSocket 또는 polling)

---

#### 2. **Posts (커뮤니티 게시글)** - 난이도: ⭐⭐⭐⭐
- `POST /api/posts` - 게시글 작성
- `GET /api/posts` - 게시글 목록 조회
- `GET /api/posts/{id}` - 게시글 상세 조회
- `PUT /api/posts/{id}` - 게시글 수정
- `DELETE /api/posts/{id}` - 게시글 삭제
- `POST /api/posts/{id}/comments` - 댓글 작성
- `GET /api/posts/{id}/comments` - 댓글 목록 조회
- `DELETE /api/posts/comments/{comment_id}` - 댓글 삭제
- `POST /api/posts/{id}/like` - 게시글 좋아요
- `DELETE /api/posts/{id}/like` - 게시글 좋아요 취소

**관련 컴포넌트:**
- `src/components/BoardPage.tsx`
- `src/components/PostDetailPage.tsx`
- 게시글 작성 모달 (신규 생성 필요)
- 댓글 컴포넌트 (신규 생성 필요)

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/postService.ts`)
- 게시글 목록 조회 및 무한 스크롤/페이지네이션
- 게시글 작성/수정/삭제 기능
- 게시글 상세 페이지 구현
- 댓글 CRUD 기능 구현
- 게시글 좋아요 기능
- 이미지 업로드 (게시글 첨부)

---

#### 3. **Achievements (업적)** - 난이도: ⭐⭐⭐
- `GET /api/achievements` - 모든 업적 목록 조회
- `GET /api/achievements/users/{user_id}` - 특정 사용자의 업적 조회
- `POST /api/achievements/check` - 업적 조건 체크 및 자동 부여

**관련 컴포넌트:**
- 업적 페이지 컴포넌트 (신규 생성 필요)
- `src/components/ProfilePage.tsx` (업적 표시)

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/achievementService.ts`)
- 업적 목록 페이지 구현
- 사용자 업적 표시 (프로필 페이지)
- 업적 달성 알림 컴포넌트
- 업적 진행도 표시 (프로그레스 바)

---

#### 4. **Chat (채팅)** - 난이도: ⭐⭐⭐⭐⭐
- `POST /api/chat/rooms` - 채팅방 생성 (1:1 채팅)
- `GET /api/chat/rooms` - 내 채팅방 목록 조회
- `GET /api/chat/rooms/{chat_room_id}/messages` - 특정 채팅방 메시지 히스토리 조회
- `DELETE /api/chat/rooms/{chat_room_id}` - 채팅방 나가기
- `GET /api/chat/unread-count` - 읽지 않은 메시지 총 개수 조회

**관련 컴포넌트:**
- `src/components/ChatPage.tsx`
- `src/components/ChatRoomPage.tsx`
- 메시지 입력 컴포넌트 (신규 생성 필요)

**작업 내용:**
- API 서비스 레이어 생성 (`src/services/chatService.ts`)
- 채팅방 목록 조회 및 표시
- 채팅방 생성 로직
- 메시지 전송 및 수신 (WebSocket 또는 Server-Sent Events)
- 실시간 메시지 업데이트
- 읽지 않은 메시지 카운트 표시
- 메시지 히스토리 스크롤 처리
- 채팅방 나가기 기능

---

### 📦 개발자 B 추가 작업
- **상태 관리:**
  - React Query 또는 SWR 설정 (선택사항)
  - 전역 상태 관리 (Context API 또는 Zustand)
- **실시간 기능:**
  - WebSocket 클라이언트 설정
  - 실시간 업데이트 훅 생성

---

## 📈 난이도 비교

| 개발자 | 도메인 수 | API 개수 | 평균 난이도 | 주요 복잡도 |
|--------|----------|----------|------------|------------|
| **A** | 4개 | 20개 | ⭐⭐⭐ | 인증, 이미지 업로드, GPS |
| **B** | 4개 | 21개 | ⭐⭐⭐⭐ | 실시간 채팅, 매칭 로직, 댓글 시스템 |

---

## 🔄 작업 순서 제안

### 개발자 A 작업 순서
1. **1주차**: Auth API 연동 + 공통 인프라 구축
2. **2주차**: Users API 연동 (프로필 수정, 이미지 업로드)
3. **3주차**: Tags API 연동 + Running Records API 연동
4. **4주차**: GPS 기능 + 주변 러너 검색 + 테스트 및 버그 수정

### 개발자 B 작업 순서
1. **1주차**: Posts API 연동 (게시글 CRUD)
2. **2주차**: Posts 댓글 기능 + 좋아요 기능
3. **3주차**: Likes & Matches API 연동
4. **4주차**: Chat API 연동 (WebSocket 포함) + Achievements + 테스트 및 버그 수정

---

## 🤝 협업 포인트

### 공유해야 할 부분
1. **API 클라이언트 설정**: 개발자 A가 먼저 구축하고 공유
2. **타입 정의**: 각자 도메인 타입 정의 후 공유
3. **에러 처리**: 공통 에러 핸들링 방식 협의
4. **로딩 상태**: 공통 로딩 컴포넌트 사용

### 독립적으로 작업 가능한 부분
- 각자의 도메인 API 연동
- 각자의 컴포넌트 수정
- 각자의 서비스 레이어 구축

---

## 📝 체크리스트

### 개발자 A
- [ ] Auth API 연동 완료
- [ ] Users API 연동 완료
- [ ] Tags API 연동 완료
- [ ] Running Records API 연동 완료
- [ ] 공통 인프라 구축 완료
- [ ] 에러 핸들링 구현 완료

### 개발자 B
- [ ] Likes & Matches API 연동 완료
- [ ] Posts API 연동 완료 (게시글 + 댓글)
- [ ] Achievements API 연동 완료
- [ ] Chat API 연동 완료 (실시간 포함)
- [ ] 상태 관리 설정 완료
- [ ] 실시간 기능 구현 완료

---

## 💡 추가 권장사항

1. **API 문서 확인**: 각 API의 요청/응답 스펙을 정확히 확인
2. **에러 케이스**: 네트워크 오류, 인증 오류 등 다양한 에러 케이스 처리
3. **로딩 상태**: 모든 비동기 작업에 로딩 상태 표시
4. **유효성 검사**: 폼 입력값 유효성 검사 강화
5. **반응형 디자인**: 모바일/데스크톱 대응 확인
6. **성능 최적화**: 이미지 최적화, 무한 스크롤 최적화 등

---

## 🚀 시작하기

각 개발자는 자신의 담당 도메인부터 시작하여 순차적으로 진행하되, 공통 인프라는 먼저 협의하여 구축하는 것을 권장합니다.

