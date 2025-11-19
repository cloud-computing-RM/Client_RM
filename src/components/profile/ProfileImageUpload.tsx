import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Camera } from "lucide-react";

interface ProfileImageUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
}

export function ProfileImageUpload({ currentImage, onImageChange }: ProfileImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("파일 크기는 2MB 이하여야 합니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setImagePreview(imageUrl);
      onImageChange(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>프로필 사진</Label>
      <div className="flex flex-col items-center space-y-3">
        <div
          className="relative cursor-pointer group"
          onClick={handleImageClick}
        >
          <ImageWithFallback
            src={imagePreview || currentImage}
            alt="프로필 사진"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleImageClick}
          >
            사진 변경
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            2MB 이하의 이미지 파일
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
