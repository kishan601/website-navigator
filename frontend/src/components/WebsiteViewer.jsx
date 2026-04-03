import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

function WebsiteViewer({
  urls,
  currentIndex,
  isCheckingIframe,
  isBlocked,
  onPrev,
  onNext,
  onReset,
}) {
  const currentUrl = urls[currentIndex];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 shadow-sm z-10">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center lg:justify-between">
          <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 border border-gray-200 flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
            <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors truncate">
              {currentUrl}
            </a>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              {currentIndex + 1} of {urls.length}
            </span>
            <button
              onClick={onReset}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap"
            >
              Upload New File
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-200 relative w-full min-h-0">
        {isCheckingIframe ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600">Checking website compatibility...</p>
          </div>
        ) : isBlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cannot display this website</h3>
            <p className="text-gray-600 mb-4">
              This website has security policies that prevent it from being embedded here.
            </p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Open in new tab
            </a>
          </div>
        ) : (
          <iframe
            key={`iframe-${currentIndex}-${currentUrl}`}
            src={currentUrl}
            title={`Website ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full border-0 bg-white"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === urls.length - 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentIndex === urls.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebsiteViewer;
