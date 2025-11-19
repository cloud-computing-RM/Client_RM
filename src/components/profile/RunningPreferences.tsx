import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface RunningPreferencesProps {
  preferences: {
    pace: string;
    distance: string;
    time: string;
    frequency: string;
  };
  onPreferenceChange: (field: string, value: string) => void;
}

export function RunningPreferences({ preferences, onPreferenceChange }: RunningPreferencesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">러닝 선호도</h3>

      <div className="space-y-2">
        <Label>선호 페이스</Label>
        <Select
          value={preferences.pace}
          onValueChange={(value) => onPreferenceChange("pace", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4:30-5:00/km">4:30-5:00/km</SelectItem>
            <SelectItem value="5:00-5:30/km">5:00-5:30/km</SelectItem>
            <SelectItem value="5:30-6:00/km">5:30-6:00/km</SelectItem>
            <SelectItem value="6:00-6:30/km">6:00-6:30/km</SelectItem>
            <SelectItem value="6:30-7:00/km">6:30-7:00/km</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>선호 거리</Label>
        <Select
          value={preferences.distance}
          onValueChange={(value) => onPreferenceChange("distance", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-3km">1-3km</SelectItem>
            <SelectItem value="3-5km">3-5km</SelectItem>
            <SelectItem value="5-8km">3-8km</SelectItem>
            <SelectItem value="8-10km">5-10km</SelectItem>
            <SelectItem value="10km+">10km+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>선호 시간대</Label>
        <Select
          value={preferences.time}
          onValueChange={(value) => onPreferenceChange("time", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="새벽 (05:00-07:00)">새벽 (05:00-07:00)</SelectItem>
            <SelectItem value="오전 (07:00-12:00)">오전 (07:00-12:00)</SelectItem>
            <SelectItem value="오후 (12:00-18:00)">오후 (12:00-18:00)</SelectItem>
            <SelectItem value="저녁 (18:00-22:00)">저녁 (18:00-22:00)</SelectItem>
            <SelectItem value="밤 (22:00-00:00)">밤 (22:00-00:00)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>운동 빈도</Label>
        <Select
          value={preferences.frequency}
          onValueChange={(value) => onPreferenceChange("frequency", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="주 1-2회">주 1-2회</SelectItem>
            <SelectItem value="주 3-4회">주 3-4회</SelectItem>
            <SelectItem value="주 5-6회">주 5-6회</SelectItem>
            <SelectItem value="매일">매일</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
