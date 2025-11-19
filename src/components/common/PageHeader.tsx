import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  action?: ReactNode;
}

export function PageHeader({ title, description, onBack, action }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-3xl">{title}</h1>
              {description && (
                <p className="text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}
