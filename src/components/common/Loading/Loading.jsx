import { Loader2 } from 'lucide-react';

// Common Loading Component
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
        <p className="text-chilled-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
