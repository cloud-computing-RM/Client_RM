interface StatCardProps {
  value: string | number;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className = "" }: StatCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-3xl sm:text-4xl mb-2 text-[#1e3a8a]">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
