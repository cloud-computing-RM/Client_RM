import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface BasicInfoFormProps {
  name: string;
  age: number;
  location: string;
  bio: string;
  onFieldChange: (field: string, value: any) => void;
}

export function BasicInfoForm({ name, age, location, bio, onFieldChange }: BasicInfoFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onFieldChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">나이</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => onFieldChange("age", parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">위치</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onFieldChange("location", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">자기소개</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onFieldChange("bio", e.target.value)}
          rows={3}
        />
      </div>
    </>
  );
}
