import { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Zap, TrendingUp, Trophy } from "lucide-react";
import { AddRecordModal } from "./AddRecordModal";
import { RecordCard, RunRecord } from "./records/RecordCard";
import { PageHeader } from "./common/PageHeader";

export function RecordsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [records, setRecords] = useState<RunRecord[]>([
    {
      id: 1,
      date: "2024-12-29",
      distance: 5.2,
      duration: "28:45",
      pace: "5:32/km",
      location: "한강공원",
      notes: "날씨가 좋아서 기분 좋게 뛸 수 있었어요!",
      feeling: 'great'
    },
    {
      id: 2,
      date: "2024-12-27",
      distance: 3.8,
      duration: "22:30",
      pace: "5:55/km",
      location: "올림픽공원",
      notes: "조금 피곤했지만 완주!",
      feeling: 'normal'
    },
    {
      id: 3,
      date: "2024-12-25",
      distance: 7.1,
      duration: "42:15",
      pace: "5:57/km",
      location: "청계천",
      notes: "크리스마스 특별 런! 사람이 많았어요",
      feeling: 'good'
    }
  ]);

  const handleAddRecord = (newRecord: Omit<RunRecord, 'id'>) => {
    const record = {
      ...newRecord,
      id: Date.now()
    };
    setRecords(prev => [record, ...prev]);
    setShowAddModal(false);
  };

  const totalDistance = records.reduce((sum, record) => sum + record.distance, 0);
  const totalRuns = records.length;
  const avgPace = "5:48/km";

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="러닝 기록"
        description="나의 러닝 여정을 기록하고 성장을 확인하세요"
        action={
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#1e3a8a] hover:bg-[#1e40af]"
          >
            <Plus size={18} className="mr-2" />
            기록 추가
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Stats & Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg mb-6">이달의 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">총 거리</div>
                      <div className="text-2xl text-[#1e3a8a]">{totalDistance.toFixed(1)}km</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Trophy size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">총 런</div>
                      <div className="text-2xl text-green-600">{totalRuns}회</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Zap size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">평균 페이스</div>
                      <div className="text-2xl text-orange-600">{avgPace}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white rounded-2xl p-6">
              <h3 className="text-lg mb-3">💡 러닝 팁</h3>
              <p className="text-sm text-blue-100">
                꾸준함이 가장 중요합니다. 매일 조금씩이라도 기록을 남겨보세요!
              </p>
            </div>
          </div>

          {/* Right: Records List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                  <div className="text-4xl mb-4">🏃‍♂️</div>
                  <h3 className="text-xl mb-2">아직 기록이 없습니다</h3>
                  <p className="text-gray-600 mb-6">
                    첫 러닝 기록을 추가해보세요!
                  </p>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#1e3a8a] hover:bg-[#1e40af]"
                  >
                    <Plus size={18} className="mr-2" />
                    기록 추가
                  </Button>
                </div>
              ) : (
                records.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddRecordModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRecord}
        />
      )}
    </div>
  );
}
