import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export function FeatureCard({ icon, title, description, onClick }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-8 rounded-2xl hover:shadow-lg transition-all text-left border border-gray-200 hover:border-[#1e3a8a] group w-full"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors text-[#1e3a8a]">
        {icon}
      </div>
      <h3 className="text-xl mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      <div className="mt-4 text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity text-[#1e3a8a]">
        자세히 보기
        <ArrowRight size={16} className="ml-1" />
      </div>
    </button>
  );
}
