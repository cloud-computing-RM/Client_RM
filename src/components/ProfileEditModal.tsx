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

interface ProfileEditModalProps {
  user: any;
  onClose: () => void;
  onSave: (updatedUser: any) => void;
}

export function ProfileEditModal({ user, onClose, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    location: user.location,
    bio: user.bio,
    preferences: { ...user.preferences },
    tags: [...user.tags],
    profileImage: user.profileImage,
  });

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

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }));
  };

  const handleSave = () => {
    onSave({
      ...user,
      ...formData,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
          <DialogDescription>프로필 정보를 수정하세요.</DialogDescription>
        </DialogHeader>

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
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#1e3a8a] hover:bg-[#1e40af]"
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
