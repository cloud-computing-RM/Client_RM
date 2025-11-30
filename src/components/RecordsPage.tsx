import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus, Zap, TrendingUp, Trophy } from "lucide-react";
import { AddRecordModal } from "./AddRecordModal";
import { RecordCard, RunRecord } from "./records/RecordCard";
import { PageHeader } from "./common/PageHeader";
import { getRecords, createRecord, deleteRecord } from "../services/recordService";
import type { RunningRecord, RunningRecordCreateRequest } from "../types";

export function RecordsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 러닝 기록 목록 로드
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRecords({ sort: 'date_desc' });
      // Backend RunningRecord to Frontend RunRecord 변환
      const convertedRecords: RunRecord[] = response.records.map((record) => ({
        id: record.record_id,
        date: record.date.split('T')[0], // ISO date to YYYY-MM-DD
        distance: Number(record.distance),
        duration: record.duration,
        pace: record.pace,
        location: record.location,
        feeling: record.feeling,
        notes: record.notes || undefined,
      }));
      setRecords(convertedRecords);
    } catch (err: any) {
      console.error('Failed to load records:', err);
      setError(err.message || '기록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (newRecord: Omit<RunRecord, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const requestData: RunningRecordCreateRequest = {
        date: newRecord.date,
        distance: newRecord.distance,
        duration: newRecord.duration,
        pace: newRecord.pace,
        location: newRecord.location,
        feeling: newRecord.feeling,
        notes: newRecord.notes,
      };

      const createdRecord = await createRecord(requestData);

      // Backend response를 Frontend format으로 변환
      const convertedRecord: RunRecord = {
        id: createdRecord.record_id,
        date: createdRecord.date.split('T')[0],
        distance: Number(createdRecord.distance),
        duration: createdRecord.duration,
        pace: createdRecord.pace,
        location: createdRecord.location,
        feeling: createdRecord.feeling,
        notes: createdRecord.notes || undefined,
      };

      setRecords(prev => [convertedRecord, ...prev]);
      setShowAddModal(false);
    } catch (err: any) {
      console.error('Failed to create record:', err);
      setError(err.message || '기록 추가에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (!confirm('정말 이 기록을 삭제하시겠습니까?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await deleteRecord(id);
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (err: any) {
      console.error('Failed to delete record:', err);
      setError(err.message || '기록 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalDistance = records.reduce((sum, record) => sum + record.distance, 0);
  const totalRuns = records.length;

  // 평균 페이스 계산: 총 시간 / 총 거리
  const calculateAvgPace = () => {
    if (records.length === 0) return "0:00/km";

    let totalSeconds = 0;
    records.forEach(record => {
      const [minutes, seconds] = record.duration.split(':').map(Number);
      totalSeconds += (minutes * 60) + (seconds || 0);
    });

    const avgPaceMinutes = totalSeconds / 60 / totalDistance;
    const paceMin = Math.floor(avgPaceMinutes);
    const paceSec = Math.round((avgPaceMinutes - paceMin) * 60);

    return `${paceMin}:${paceSec.toString().padStart(2, '0')}/km`;
  };

  const avgPace = calculateAvgPace();

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
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {isLoading && records.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">기록을 불러오는 중...</div>
          </div>
        ) : (
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
                  <RecordCard
                    key={record.id}
                    record={record}
                    onDelete={handleDeleteRecord}
                  />
                ))
              )}
            </div>
          </div>
          </div>
        )}
      </div>

      <AddRecordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddRecord}
      />
    </div>
  );
}
