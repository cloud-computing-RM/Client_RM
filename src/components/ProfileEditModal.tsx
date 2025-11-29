import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ProfileImageUpload } from "./profile/ProfileImageUpload";
import { BasicInfoForm } from "./profile/BasicInfoForm";
import { RunningPreferences } from "./profile/RunningPreferences";
import { TagManager } from "./profile/TagManager";
import { updateProfile, updatePreferences, updateProfileImage } from "../services/userService";
import type { User } from "../types";

interface ProfileEditModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export function ProfileEditModal({ user, onClose, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age || 0,
    location: user.location,
    bio: user.bio || '',
    preferences: {
      preferred_time: user.preferred_time || '',
      preferred_frequency: user.preferred_frequency || '',
      preferred_pace_min: user.preferred_pace_min,
      preferred_pace_max: user.preferred_pace_max,
      preferred_distance_min: user.preferred_distance_min,
      preferred_distance_max: user.preferred_distance_max,
    },
    tags: user.tags || [],
    profileImage: user.profile_image || '',
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const handleImageChange = (imageUrl: string, file?: File) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }));
    if (file) {
      setProfileImageFile(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let finalUser;

      // 1. 프로필 이미지 업데이트 (파일이 선택된 경우에만)
      if (profileImageFile) {
        finalUser = await updateProfileImage(profileImageFile);
      }

      // 2. 기본 프로필 정보 업데이트
      const updatedUser = await updateProfile({
        name: formData.name,
        age: formData.age,
        location: formData.location,
        bio: formData.bio,
      });
      finalUser = updatedUser;

      // 3. 러닝 선호도 업데이트
      if (
        formData.preferences.preferred_time ||
        formData.preferences.preferred_frequency ||
        formData.preferences.preferred_pace_min ||
        formData.preferences.preferred_pace_max ||
        formData.preferences.preferred_distance_min ||
        formData.preferences.preferred_distance_max
      ) {
        finalUser = await updatePreferences(formData.preferences);
      }

      // 로컬 스토리지 업데이트
      localStorage.setItem('runmate_user', JSON.stringify(finalUser));

      onSave(finalUser);
      onClose();
    } catch (err: any) {
      setError(err.message || '프로필 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
          <DialogDescription>프로필 정보를 수정하세요.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <ProfileImageUpload
            currentImage={formData.profileImage}
            onImageChange={handleImageChange}
          />

          <BasicInfoForm
            name={formData.name}
            age={formData.age}
            location={formData.location}
            bio={formData.bio}
            onFieldChange={handleInputChange}
          />

          <RunningPreferences
            preferences={formData.preferences}
            onPreferenceChange={handlePreferenceChange}
          />

          <TagManager
            tags={formData.tags}
            onTagsChange={handleTagsChange}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#1e3a8a] hover:bg-[#1e40af]"
              disabled={isLoading}
            >
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
