import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: {
    date: string;
    distance: number;
    duration: string;
    pace: string;
    location: string;
    notes?: string;
    feeling: 'great' | 'good' | 'okay' | 'tired';
  }) => void;
}

export function AddRecordModal({ isOpen, onClose, onAdd }: AddRecordModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    location: '',
    notes: '',
    feeling: 'good' as 'great' | 'good' | 'okay' | 'tired'
  });

  const calculatePace = (distance: number, duration: string): string => {
    if (!distance || !duration) return '';
    
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalMinutes = minutes + (seconds || 0) / 60;
    const paceMinutes = totalMinutes / distance;
    const paceMin = Math.floor(paceMinutes);
    const paceSec = Math.round((paceMinutes - paceMin) * 60);
    
    return `${paceMin}:${paceSec.toString().padStart(2, '0')}/km`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const distance = parseFloat(formData.distance);
    const pace = calculatePace(distance, formData.duration);
    
    onAdd({
      date: formData.date,
      distance,
      duration: formData.duration,
      pace,
      location: formData.location,
      notes: formData.notes || undefined,
      feeling: formData.feeling
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      distance: '',
      duration: '',
      location: '',
      notes: '',
      feeling: 'good'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 러닝 기록 추가</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">날짜</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="distance">거리 (km)</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              placeholder="5.0"
              value={formData.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">시간 (분:초)</Label>
            <Input
              id="duration"
              type="text"
              placeholder="28:30"
              pattern="[0-9]+:[0-9]{2}"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">형식: 분:초 (예: 28:30)</p>
          </div>

          <div>
            <Label htmlFor="location">위치</Label>
            <Input
              id="location"
              type="text"
              placeholder="한강공원, 올림픽공원 등"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="feeling">컨디션</Label>
            <Select value={formData.feeling} onValueChange={(value) => handleInputChange('feeling', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="great">최고 😄</SelectItem>
                <SelectItem value="good">좋음 😊</SelectItem>
                <SelectItem value="okay">보통 😐</SelectItem>
                <SelectItem value="tired">피곤 😴</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">메모 (선택사항)</Label>
            <Textarea
              id="notes"
              placeholder="오늘 러닝에 대한 소감을 적어보세요..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}