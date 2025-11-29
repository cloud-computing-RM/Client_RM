import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2, X, ImagePlus } from "lucide-react";
import { createPost } from "../services/postService";
import { tokenStorage } from "../services/apiClient";
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
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 5개까지만
    if (images.length + files.length > 5) {
      setError("이미지는 최대 5개까지만 업로드할 수 있습니다.");
      return;
    }

    setUploadingImages(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const token = tokenStorage.get();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        const response = await fetch(`${apiUrl}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        const data = await response.json();
        return data.imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || '이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingImages(false);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

      const data: PostCreateRequest = {
        content: content.trim(),
        post_type: postType,
      };

      if (title.trim()) {
        data.title = title.trim();
      }

      if (images.length > 0) {
        data.images = images;
      }

      await createPost(data);

      // 성공 시 폼 초기화 및 모달 닫기
      setTitle("");
      setContent("");
      setPostType('general');
      setImages([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !uploadingImages) {
      setTitle("");
      setContent("");
      setPostType('general');
      setImages([]);
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
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`업로드 이미지 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading || uploadingImages}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 업로드 버튼 */}
            {images.length < 5 && (
              <div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading || uploadingImages}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors ${
                    (loading || uploadingImages) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingImages ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>업로드 중...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={20} />
                      <span>이미지 추가 ({images.length}/5)</span>
                    </>
                  )}
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
              disabled={loading || uploadingImages}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImages || !content.trim()}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "작성 중..." : "작성하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
