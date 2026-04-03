import { FileSpreadsheet } from 'lucide-react';

function AppHeader() {
  return (
    <header className="bg-white shadow-sm py-4 px-4 sm:px-6 border-b border-gray-200 flex items-center justify-between z-10">
      <div className="flex items-center gap-2 min-w-0">
        <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
          <FileSpreadsheet size={24} />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Website Navigator</h1>
      </div>
    </header>
  );
}

export default AppHeader;
