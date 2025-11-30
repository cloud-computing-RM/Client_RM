import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { getAllTags, addUserTag, removeUserTag } from "../../services/tagService";
import type { Tag } from "../../types";

interface TagManagerProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  time: "⏰ 시간대 선호",
  level: "🎯 레벨/경험",
  purpose: "💪 러닝 목적/스타일",
  social: "👥 소셜 성향",
  environment: "🌳 러닝 환경",
  interest: "✨ 특별 관심사",
};

export function TagManager({ tags, onTagsChange }: TagManagerProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 전체 태그 목록 로드
  useEffect(() => {
    const loadTags = async () => {
      try {
        const allTags = await getAllTags();
        setAvailableTags(allTags);
      } catch (err: any) {
        console.error('Failed to load tags:', err);
      }
    };
    loadTags();
  }, []);

  // 카테고리별로 하나만 선택 가능
  const addTag = async (tag: Tag) => {
    // 이미 선택된 태그인지 확인
    if (tags.find(t => t.tag_id === tag.tag_id)) {
      setError('이미 추가된 태그입니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // 같은 카테고리의 기존 태그 찾기
      const existingTagInCategory = tags.find((t) => t.category === tag.category);

      // 같은 카테고리의 기존 태그가 있으면 제거
      if (existingTagInCategory) {
        try {
          await removeUserTag(existingTagInCategory.tag_id);
        } catch (err) {
          // 이미 제거된 경우 무시
          console.log('Tag already removed');
        }
      }

      // 새 태그 추가
      await addUserTag(tag.tag_id);

      // 로컬 상태 즉시 업데이트 (UI 반응성 향상)
      const updatedTags = existingTagInCategory
        ? tags.filter((t) => t.tag_id !== existingTagInCategory.tag_id)
        : tags;
      onTagsChange([...updatedTags, tag]);
    } catch (err: any) {
      // 409 Conflict 에러 처리
      if (err.status === 409) {
        setError('이미 추가된 태그입니다.');
      } else {
        setError(err.message || '태그 추가에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeTag = async (tagId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await removeUserTag(tagId);
      onTagsChange(tags.filter((tag) => tag.tag_id !== tagId));
    } catch (err: any) {
      setError(err.message || '태그 제거에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리별로 태그 그룹핑
  const tagsByCategory = availableTags.reduce((acc: Record<string, Tag[]>, tag: Tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  // 선택된 태그를 카테고리별로 가져오기
  const getSelectedTagForCategory = (category: string) => {
    return tags.find((tag) => tag.category === category);
  };

  return (
    <div className="space-y-4">
      <Label>태그 (각 카테고리에서 하나씩 선택)</Label>

      {error && (
        <div className="text-xs text-red-500">{error}</div>
      )}

      {availableTags.length === 0 ? (
        <div className="text-xs text-gray-500">태그 목록을 불러오는 중...</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(tagsByCategory).map(([category, categoryTags]) => {
            const selectedTag = getSelectedTagForCategory(category);

            return (
              <div key={category} className="space-y-1">
                <Label className="text-xs text-gray-600">
                  {CATEGORY_LABELS[category] || category}
                </Label>

                <div className="flex flex-wrap gap-1">
                  {categoryTags.map((tag) => {
                    const isSelected = selectedTag?.tag_id === tag.tag_id;

                    return (
                      <Badge
                        key={tag.tag_id}
                        variant={isSelected ? "secondary" : "outline"}
                        className={`text-xs cursor-pointer ${
                          isSelected
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            removeTag(tag.tag_id);
                          } else {
                            addTag(tag);
                          }
                        }}
                      >
                        {isSelected ? (
                          <>
                            #{tag.tag_name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTag(tag.tag_id);
                              }}
                              className="ml-1 hover:text-red-500"
                              disabled={isLoading}
                            >
                              <X size={10} />
                            </button>
                          </>
                        ) : (
                          `${tag.tag_name}`
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
