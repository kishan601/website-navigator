import { AlertCircle } from 'lucide-react';

function ErrorAlert({ error }) {
  if (!error) {
    return null;
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md flex items-start gap-3 w-[calc(100%-2rem)] max-w-md">
      <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
      <div>
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
      </div>
    </div>
  );
}

export default ErrorAlert;
