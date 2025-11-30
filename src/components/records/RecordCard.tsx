import { Calendar, MapPin, Clock, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export interface RunRecord {
  id: number;
  date: string;
  distance: number;
  duration: string;
  pace: string;
  location: string;
  feeling: 'great' | 'good' | 'normal' | 'tired';
  notes?: string;
}

interface RecordCardProps {
  record: RunRecord;
  onDelete?: (id: number) => void;
}

export function RecordCard({ record, onDelete }: RecordCardProps) {
  const getFeelingColor = (feeling: RunRecord['feeling']) => {
    switch (feeling) {
      case 'great': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'normal': return 'bg-gray-500';
      case 'tired': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getFeelingText = (feeling: RunRecord['feeling']) => {
    switch (feeling) {
      case 'great': return '최고';
      case 'good': return '좋음';
      case 'normal': return '보통';
      case 'tired': return '피곤';
      default: return '보통';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#1e3a8a] transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>{record.date}</span>
        </div>
        <div className={`${getFeelingColor(record.feeling)} text-white px-3 py-1 rounded-full text-xs`}>
          {getFeelingText(record.feeling)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-2xl text-[#1e3a8a] mb-1">{record.distance}</div>
          <div className="text-xs text-gray-600">거리 (km)</div>
        </div>
        <div>
          <div className="text-2xl text-[#1e3a8a] mb-1">{record.duration}</div>
          <div className="text-xs text-gray-600">시간</div>
        </div>
        <div>
          <div className="text-2xl text-[#1e3a8a] mb-1">{record.pace}</div>
          <div className="text-xs text-gray-600">페이스</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <MapPin size={16} />
        <span>{record.location}</span>
      </div>

      {record.notes && (
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
          {record.notes}
        </p>
      )}

      {onDelete && (
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(record.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-1" />
            삭제
          </Button>
        </div>
      )}
    </div>
  );
}
