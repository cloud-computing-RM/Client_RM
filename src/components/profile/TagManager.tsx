import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagManager({ tags, onTagsChange }: TagManagerProps) {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Label>태그</Label>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-red-500"
            >
              <X size={10} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="새 태그 추가"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTag()}
        />
        <Button
          onClick={addTag}
          variant="outline"
          size="sm"
        >
          추가
        </Button>
      </div>
    </div>
  );
}
