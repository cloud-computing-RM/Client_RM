import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2, X, ImagePlus } from "lucide-react";
import { createPost, uploadImage } from "../services/postService";
import type { PostCreateRequest } from "../types";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ open, onClose, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<'general' | 'question' | 'review'>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 이미지 선택 핸들러 (미리보기만 생성)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 5개까지만
    if (imageFiles.length + files.length > 5) {
      setError("이미지는 최대 5개까지만 선택할 수 있습니다.");
      return;
    }

    setError(null);

    const newFiles = Array.from(files);
    const newPreviews: string[] = [];

    // 미리보기 URL 생성
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setImageFiles([...imageFiles, ...newFiles]);
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('게시글 작성 시작');

      // 1. 이미지 파일들을 먼저 업로드
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        console.log(`${imageFiles.length}개의 이미지 업로드 시작`);
        try {
          const uploadPromises = imageFiles.map((file) => uploadImage(file));
          uploadedImageUrls = await Promise.all(uploadPromises);
          console.log('이미지 업로드 완료:', uploadedImageUrls);
        } catch (uploadErr: any) {
          console.error('이미지 업로드 실패:', uploadErr);
          setError(uploadErr.message || "이미지 업로드에 실패했습니다.");
          setLoading(false);
          return;
        }
      }

      // 2. 게시글 작성
      const data: PostCreateRequest = {
        content: content.trim(),
        post_type: postType,
      };

      if (title.trim()) {
        data.title = title.trim();
      }

      if (uploadedImageUrls.length > 0) {
        data.images = uploadedImageUrls;
      }

      console.log('게시글 작성 요청 데이터:', data);

      const result = await createPost(data);
      console.log('게시글 작성 완료:', result);

      // 성공 시 폼 초기화 및 모달 닫기
      setTitle("");
      setContent("");
      setPostType('general');
      setImageFiles([]);
      setImagePreviews([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('게시글 작성 실패:', err);
      setError(err.message || "게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setContent("");
      setPostType('general');
      setImageFiles([]);
      setImagePreviews([]);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>게시글 작성</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 게시글 타입 */}
          <div>
            <label className="block text-sm font-medium mb-2">게시글 유형</label>
            <Select value={postType} onValueChange={(value) => setPostType(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">일반</SelectItem>
                <SelectItem value="question">질문</SelectItem>
                <SelectItem value="review">후기</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              제목 <span className="text-gray-400">(선택사항)</span>
            </label>
            <Input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              disabled={loading}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              disabled={loading}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {content.length} / 10000
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              이미지 <span className="text-gray-400">(선택사항, 최대 5개)</span>
            </label>

            {/* 이미지 미리보기 */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`선택된 이미지 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 이미지 선택 버튼 */}
            {imageFiles.length < 5 && (
              <div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ImagePlus size={20} />
                  <span>이미지 추가 ({imageFiles.length}/5)</span>
                </label>
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? (imageFiles.length > 0 ? "업로드 및 작성 중..." : "작성 중...") : "작성하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
