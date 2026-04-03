import { FileSpreadsheet, Loader2, Upload } from 'lucide-react';

function UploadSection({ file, isLoading, onFileChange, onUpload }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <FileSpreadsheet size={32} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Welcome to Website Navigator</h2>
        <p className="text-gray-500 mb-8">
          Upload an Excel (.xlsx) or CSV file containing website URLs. We&apos;ll extract them and let you
          seamlessly navigate through the sites.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="file"
            id="main-file-upload"
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={onFileChange}
          />
          <label
            htmlFor="main-file-upload"
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 hover:bg-gray-50 hover:border-blue-400 transition-all flex flex-col items-center gap-3"
          >
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600 break-all">
              {file ? file.name : 'Click to select Excel/CSV file'}
            </span>
          </label>

          <button
            onClick={onUpload}
            disabled={!file || isLoading}
            className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all shadow-sm ${
              !file || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : null}
            {isLoading ? 'Processing...' : 'Start Navigating'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadSection;
